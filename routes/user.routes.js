const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const Publication = require("../models/Publication.model");
const Comment = require("../models/Comment.model");

// Import middlewares
const {
  isUserLoggedIn,
  isAdmin,
  isModeratorOrAdmin,
} = require("../middlewares/auth.middlewares.js");


//* Publication and comment creation routes
// POST "/user/publication/create" => creates a new publication for a user in the DB
router.post("/publication/create", isUserLoggedIn, async (req, res, next) => {
  const { title, content, file, comment } = req.body;

  const newPublication = {
    title,
    content,
    file,
    user: req.session.userOnline,
    //comment,
    //user: res.locals.currentUser also works
  };

  // // Validation 1: fields mustn't be empty
  // if (title === "" || content === "") {
  //     res.render("CREAR PARTIALS", {
  //       errorMessage: "All the fields must be completed",
  //     });
  //     return;
  //   }

  try {
    await Publication.create(newPublication);

    res.redirect("/");
  } catch (error) {
    next(error);
  }
});


// POST "/user/coment/create" => creates a new coment for a publication in the DB
router.post(
  "/:publicationId/commentcreate",
  isUserLoggedIn,
  async (req, res, next) => {
    const { publicationId } = req.params;
    const { message } = req.body;
    console.log(req.params);

    // const newComent = {
    //     message,
    //     user: req.session.userOnline,
    //     publication: response1

    // }
    try {
      const response1 = await Publication.findById(publicationId);
      const addedComment = await Comment.create({
        message,
        user: req.session.userOnline,
        publication: response1,
      });

      const x = await Publication.findByIdAndUpdate(publicationId, {
        comment: [addedComment],
      });

      res.redirect("/");
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
