const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const Publication = require("../models/Publication.model");

// Import middlewares
const {
  isUserLoggedIn,
  isAdmin,
  isModeratorOrAdmin,
} = require("../middlewares/auth.middlewares.js");

// GET /profile => Renders user profile page
router.get("/", isUserLoggedIn, async (req, res, next) => {
  try {
    const userOnlineDetails = await User.findById(req.session.userOnline);
    const publicationUserOnline = await Publication.find({user: userOnlineDetails}).populate("user")
  
    res.render("profile/my-profile.hbs", {
      profileDetails: userOnlineDetails,
      publicationUserOnline: publicationUserOnline

    });
    console.log(publicationUserOnline)
  

  } catch (error) {
    next(error);
  }
});

// GET "/profile/publications/:publicationId/details" => renders the details of each own publication
router.get("/publications/:publicationId/details", isUserLoggedIn, async (req, res, next) => {
  const { publicationId } = req.params;

  try {
    const publicationDetails = await Publication.findById(publicationId).populate("user");

    res.render("publications/pending/details.hbs", {
      publicationDetails: publicationDetails,
    });
  } catch (error) {
    next(error);
  }
}
);

// // POST "/admin/publications/:publicationId/details" => edit current publication and redirects to pending list
// router.post("/publications/:publicationId/details", async (req, res, next) => {
// const { publicationId } = req.params;
// const { title, content, file, approved } = req.body;

// const publicationToUpdate = {
//   title,
//   content,
//   file,
//   approved,
// }

// try {
//   await Publication.findByIdAndUpdate(publicationId, publicationToUpdate, {new: true,});

//   res.redirect("/admin/publications");
// } catch (error) {
//   next(error);
// }
// });

module.exports = router;
