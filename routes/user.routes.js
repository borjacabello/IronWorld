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
const { findByIdAndUpdate } = require("../models/User.model");

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

// GET "/user/search-publication" => renders searched publications page from "/"
router.get("/search-publication", async (req, res, next) => {
  // To lower case the searched term to correctly compare it with the publications
  let searchTerm = req.query.searchTerm.toLowerCase();

  // Variables to lowercase title and content in the publications
  let searchInTitle;
  let searchInContent;

  // Regular expression to match any non-blank space character in a string
  const regexBlankSpaces = /\S/;

  // Variable to check if some result has matched the search query
  let matchedResult = false;

  // Validation: search can't be empty or be equal to blank spaces
  if (searchTerm === "" || !regexBlankSpaces.test(searchTerm)) {
    res.render("publications/search-publication.hbs", {
      errorMessage:
        "Your search can't be empty nor containing only blank spaces!",
    });
    return;
  }

  try {
    const approvedList = await Publication.find({ approved: true })
      .sort({ createdAt: -1 })
      .populate("user", "username profileImage");

    const filteredPublications = JSON.parse(JSON.stringify(approvedList));

    filteredPublications.forEach((eachPublication) => {
      searchInTitle = eachPublication.title.toLowerCase().includes(searchTerm);
      searchInContent = eachPublication.content
        .toLowerCase()
        .includes(searchTerm);

      if (searchInTitle || searchInContent) {
        eachPublication.searched = true;
        matchedResult = true;
      }
    });

    filteredPublications.forEach((eachPublication) => {
      eachPublication.createdAt = new Intl.DateTimeFormat("es-ES", {
        timeStyle: "medium",
        dateStyle: "short",
      }).format(new Date(eachPublication.createdAt));
      eachPublication.updatedAt = new Intl.DateTimeFormat("es-ES", {
        timeStyle: "medium",
        dateStyle: "short",
      }).format(new Date(eachPublication.updatedAt));
    });

    res.render("publications/search-publication.hbs", {
      filteredPublications,
      searchTerm,
      matchedResult,
    });
  } catch (error) {
    next(error);
  }
});

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

      clonedPublication.comments.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      clonedPublication.comments.forEach((eachComment) => {
        eachComment.createdAt = new Intl.DateTimeFormat("es-ES", {
          timeStyle: "medium",
          dateStyle: "short",
        }).format(new Date(eachComment.createdAt));
        eachComment.updatedAt = new Intl.DateTimeFormat("es-ES", {
          timeStyle: "medium",
          dateStyle: "short",
        }).format(new Date(eachComment.updatedAt));
      });

      clonedPublication.comments.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

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

      clonedPublication.createdAt = new Intl.DateTimeFormat("es-ES", {
        timeStyle: "medium",
        dateStyle: "short",
      }).format(new Date(clonedPublication.createdAt));
      clonedPublication.updatedAt = new Intl.DateTimeFormat("es-ES", {
        timeStyle: "medium",
        dateStyle: "short",
      }).format(new Date(clonedPublication.updatedAt));

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
    const regexBlankSpaces = /\S/;

    // Validation 1: field mustn't be empty
    if (message === "" || !regexBlankSpaces.test(message)) {
      res.render("publications/comment-error.hbs", {
        errorMessage: "Comment message can't be empty",
        publicationId,
      });
      return;
    }

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

//* LIKES
// POST "/user/:publicationId/like" => adds like to the publication counter
router.post("/:publicationId/like", isUserLoggedIn, async (req, res, next) => {
  const { publicationId } = req.params;

  try {

    const userOnline = await User.findById(req.session.userOnline._id);

    const options = {
      $push: { whoLikes: userOnline},
      $inc: { likes: 1 } 
    }

    // Checks if user has already given like to the publication and if so, do nothing
    const increasedLikes = await Publication.findOneAndUpdate(
      {
        publicationId,
        whoLikes: { $ne: userOnline}
      },
      options,
      {new: true}
    );

    res.redirect("/");

  } catch (error) {
    next(error);
  }
});

// * FRIENDS
// POST "/user/_userId/add" => changes user friends status
/* router.post("/:userId/add", async (req, res, next) => {
  const { userId } = req.params;

  try {
    // Current Online User
    const currentUser = await User.findById(req.session.userOnline._id);

    // Add current online user to friends array of the target user
    await User.findByIdAndUpdate(userId, {
      $addToSet: { friends: currentUser },
      $set: {"friends.$.state": "requested" },
    });

    // Update status of the current online user request in the target user array
    /* await User.findByIdAndUpdate(
      userId,
      { 
        $set: {"friends.$[element].state": "requested" } 
      },
      { 
        arrayFilters: [{ "element.user._id": {$eq: currentUser._id}}]
      }
    ); 

    res.redirect("/");

  } catch (error) {
    next(error);
  }
}); */

module.exports = router;
