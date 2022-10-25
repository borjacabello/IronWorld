const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const Publication = require("../models/Publication.model");
const Comment = require("../models/Comment.model");
const uploader = require("../middlewares/cloudinary.js");

// Import middlewares
const {
  isUserLoggedIn,
  isAdmin,
  isModeratorOrAdmin,
} = require("../middlewares/auth.middlewares.js");

//* Publication and comment creation routes

// GET "/user/publication/create" => renders a form for create a new publication
router.get("/publication/create", isUserLoggedIn, (req, res, next) => {
  res.render("publications/new-publication.hbs");
});

// POST "/user/publication/create" => creates a new publication for a user in the DB
router.post(
  "/publication/create",
  isUserLoggedIn,
  uploader.single("file"),
  async (req, res, next) => {
    const { title, content } = req.body;

    // Validation 1: fields mustn't be empty
    if (title === "" || content === "") {
      res.render("publications/new-publication.hbs", {
        errorMessage: "All the fields must be completed",
      });
      return;
    }

    try {
      // let imageUrl;
      // if (req.file !== undefined) {
      //   imageUrl = req.file.path;
      // }

      const newPublication = {
        title: title,
        content: content,
        file: req.file?.path, // "?" if req.file is undefined, takes default value in the model
        user: req.session.userOnline,
      };
      await Publication.create(newPublication);

      res.redirect("/");
    } catch (error) {
      next(error);
    }
  }
);

// GET "/user/:publicationId/details" => renders publication details page from "/"
// *Note: this publication details page is different than the renderized one from the profile or admin publs. list
router.get(
  "/:publicationId/details",
  isUserLoggedIn,
  async (req, res, next) => {
    const { publicationId } = req.params;

    try {
      // Publication details
      const detailedPublication = await Publication.findById(publicationId)
        .populate("user", "username profileImage role")
        .populate({ path: "comments", populate: { path: "user" } });

      const clonedPublication = JSON.parse(JSON.stringify(detailedPublication));

      clonedPublication.comments.forEach((eachComment) => {
        if (
          req.session.userOnline.role === "admin" ||
          req.session.userOnline.role === "moderator"
        ) {
          eachComment.isOwner = true;
        }

        if (
          req.session.userOnline.role !== "admin" &&
          req.session.userOnline.role !== "moderator" &&
          eachComment.user._id === req.session.userOnline._id
        ) {
          eachComment.isOwner = true;
        }
      });

      res.render("publications/main-details.hbs", {
        clonedPublication,
      });
    } catch (error) {
      next(error);
    }
  }
);

// POST "/user/comment/create" => creates a new coment for a publication in the DB
router.post(
  "/:publicationId/comment/create",
  isUserLoggedIn,
  async (req, res, next) => {
    const { publicationId } = req.params;
    const { message } = req.body;

    try {
      const newComment = {
        message,
        user: req.session.userOnline,
        //publication: publicationToComment
      };

      const createdComment = await Comment.create(newComment);

      await Publication.findByIdAndUpdate(
        publicationId,
        { $push: { comments: createdComment } },
        { new: true }
      );

      res.redirect(`/user/${publicationId}/details`);
    } catch (error) {
      next(error);
    }
  }
);

// GET "/users/:commentId/edit" => renders comment details page to edit comment information
router.get(
  "/:publicationId/:commentId/edit",
  isUserLoggedIn,
  async (req, res, next) => {
    const { commentId } = req.params;
    const { publicationId } = req.params;

    try {
      const commentDetails = await Comment.findById(commentId);
      await Comment.findByIdAndUpdate(
        commentDetails,
        { edited: true },
        { new: true }
      );

      res.redirect(`/user/${publicationId}/details`);
    } catch (error) {
      next(error);
    }
  }
);

// POST "/users/:commentId/edit" => updates comment message and renders it
router.post(
  "/:publicationId/:commentId/edit",
  isUserLoggedIn,
  async (req, res, next) => {
    const { commentId } = req.params;
    const { publicationId } = req.params;
    const { message } = req.body;

    try {
      const commentToUpdate = await Comment.findById(commentId);
      await Comment.findByIdAndUpdate(
        commentToUpdate,
        { edited: false, message: message },
        { new: true }
      );

      res.redirect(`/user/${publicationId}/details`);
    } catch (error) {
      next(error);
    }
  }
);

// POST "/users/:commentId/edit" => updates comment message and renders it
router.post(
  "/:publicationId/:commentId/delete",
  isUserLoggedIn,
  async (req, res, next) => {
    const { commentId } = req.params;
    const { publicationId } = req.params;

    try {
      await Comment.findByIdAndDelete(commentId);

      res.redirect(`/user/${publicationId}/details`);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
