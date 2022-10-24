const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const Publication = require("../models/Publication.model");
const Comment = require("../models/Comment.model");
const uploader = require("../middlewares/cloudinary.js")

// Import middlewares
const {
  isUserLoggedIn,
  isAdmin,
  isModeratorOrAdmin,
} = require("../middlewares/auth.middlewares.js");


//* Publication and comment creation routes
// POST "/user/publication/create" => creates a new publication for a user in the DB
router.post("/publication/create", isUserLoggedIn, uploader.single("file"), async (req, res, next) => {
  const {title, content} = req.body;

  const newPublication = {
    title,
    content,
    file: req.file.path,
    user: req.session.userOnline,
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
router.post("/:publicationId/comment/create", isUserLoggedIn, async (req, res, next) => {
    const { publicationId } = req.params;
    const { message } = req.body;
    
    try {
      const newComment = {
        message,
        user: req.session.userOnline
        //publication: publicationToComment
      }

      const createdComment = await Comment.create(newComment);

      await Publication.findByIdAndUpdate(publicationId, {$push: {comments: createdComment}}, {new: true});

      res.redirect("/");
    } catch (error) {
      next(error);
    }
  }
);



module.exports = router;
