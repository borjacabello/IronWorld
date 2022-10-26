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
    const publicationUserOnline = await Publication.find({user: userOnlineDetails,}).populate("user");

    const clonedPublicationUserOnline = JSON.parse(JSON.stringify(publicationUserOnline))

    clonedPublicationUserOnline.sort((a, b) => new Date (b.createdAt) - new Date (a.createdAt))
  
  

    clonedPublicationUserOnline.forEach(eachPublication => {
      eachPublication.createdAt = new Intl.DateTimeFormat('es-ES', {
        timeStyle: "medium",
        dateStyle: "short"
      })
      .format(new Date(eachPublication.createdAt))

      eachPublication.updatedAt = new Intl.DateTimeFormat('es-ES', {
        timeStyle: "medium",
        dateStyle: "short"
      })
      .format(new Date(eachPublication.updatedAt))

    })

    res.render("profile/my-profile.hbs", {
      profileDetails: userOnlineDetails,
      publicationUserOnline: clonedPublicationUserOnline,
    });
  } catch (error) {
    next(error);
  }
});

// *********************** OWN PUBLICATIONS ROUTES *************************************
// GET "/profile/publications/:publicationId/details" => renders the details of each own publication
router.get(
  "/publications/:publicationId/details", isUserLoggedIn, async (req, res, next) => {
    const { publicationId } = req.params;

    try {
      const publicationDetails = await Publication.findById(publicationId).populate("user");
      console.log(publicationDetails);
      res.render("profile/publication-details.hbs", {
        publicationDetails: publicationDetails,
      });
    } catch (error) {
      next(error);
    }
  }
);

// POST "/profile/publications/:publicationId/delete" => deletes the current own publication
router.post(
  "/publications/:publicationId/delete",
  isUserLoggedIn,
  async (req, res, next) => {
    const { publicationId } = req.params;
    console.log(publicationId);
    try {
      await Publication.findByIdAndDelete(publicationId);

      res.redirect("/profile");
    } catch (error) {
      next(error);
    }
  }
);

// GET "/profile/publications/:publicationId/edit" => renders profile own publication to edit
router.get(
  "/publications/:publicationId/edit", isUserLoggedIn, async (req, res, next) => {
    const { publicationId } = req.params;
    
    try {
      const ownPublicationToEdit = await Publication.findById(publicationId);
      res.render("profile/publication-edit.hbs", {
        ownPublicationToEdit: ownPublicationToEdit,
      });
    } catch (error) {
      next(error);
    }
  }
);

// POST "/profile/publications/:publicationId/edit" => renders profile own publication to edit
router.post(
  "/publications/:publicationId/edit", isUserLoggedIn, async (req, res, next) => {
    const { publicationId } = req.params;
    const {title, content, file} = req.body
    try {
      const ownPubEdited = await Publication.findByIdAndUpdate(publicationId, {
        title,
        content,
        file
      });
      res.redirect(`/profile/publications/${publicationId}/details`);
    } catch (error) {
      next(error);
    }
  }
);


module.exports = router;
