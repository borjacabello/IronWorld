const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const Publication = require("../models/Publication.model");
const uploader = require("../middlewares/cloudinary.js");

// Import middlewares
const {
  isUserLoggedIn,
  isAdmin,
  isModeratorOrAdmin,
} = require("../middlewares/auth.middlewares.js");

// *User management routes
// GET "/admin/users" => renders the user list only for admin management purposes
router.get("/users", isAdmin, async (req, res, next) => {
  try {
    const userList = await User.find()
    

    res.render("users/list.hbs", {
      userList,
    });
  } catch (error) {
    next(error);
  }
});

// GET "/admin/users/:userId/edit" => renders user details page to edit user information
router.get("/users/:userId/edit", isAdmin, async (req, res, next) => {
  const { userId } = req.params;

  try {
    const userDetails = await User.findById(userId);

    res.render("users/edit.hbs", {
      userDetails,
    });
  } catch (error) {
    next(error);
  }
});

// POST "/admin/users/:userId/edit" => updates user parameters and redirects to user list
router.post("/users/:userId/edit", isAdmin, uploader.single("profileImage"), async (req, res, next) => {
  const { userId } = req.params;

  const {username, age, email, role, links } = req.body;

  const userToUpdate = {
    
    username: username,
    email: email,
    age: age,
    role: role,
    profileImage: req.profileImage?.path,
    links: links,
  };

  try {
    await User.findByIdAndUpdate(userId, userToUpdate, { new: true });

    res.redirect("/admin/users");
  } catch (error) {
    next(error);
  }
});

// POST "/admin/users/:userId/delete" => deletes user from user list and redirects to user list
router.post("/users/:userId/delete", isAdmin, async (req, res, next) => {
  const { userId } = req.params;

  try {
    await User.findByIdAndDelete(userId);

    res.redirect("/admin/users");
  } catch (error) {
    next(error);
  }
});

// *Publication management routes
// GET "/admin/publications" => renders publication list for both moderator and admin
router.get("/publications", isModeratorOrAdmin, async (req, res, next) => {
  try {
    const pendingList = await Publication.find({ approved: false }).sort({createdAt: -1});
    const approvedList = await Publication.find({ approved: true }).sort({createdAt: -1});
    


    if (pendingList.length === 0) {
      res.render("publications/pending/list.hbs", {
        emptyMessagePending: "There is no more publications.",
        pendingList,
        approvedList
      });
      next()
    } else if (approvedList.length === 0){
      res.render("publications/pending/list.hbs", {
        emptyMessageApproved: "All publications approved.",
        pendingList,
        approvedList
      });
      next()
    }

    res.render("publications/pending/list.hbs", {
      pendingList,
      approvedList,
    });
  } catch (error) {
    next(error);
  }
});

// POST "/admin/publications/:publicationId/approval" => approves current publication to be added to the index page list
router.post(
  "/publications/:publicationId/approval",
  isModeratorOrAdmin,
  async (req, res, next) => {
    const { publicationId } = req.params;

    try {
      // Changes boolean value "approved" to true, to use it after in index.hbs to see the publication
      const publicationToApprove = await Publication.findByIdAndUpdate(
        publicationId,
        { approved: true },
        { new: true }
      );

      res.redirect("/admin/publications");
    } catch (error) {
      next(error);
    }
  }
);

// POST "/admin/publications/:publicationId/cancel" => cancels current publication to be added to the index page list
router.post(
  "/publications/:publicationId/cancel",
  isModeratorOrAdmin,
  async (req, res, next) => {
    const { publicationId } = req.params;

    try {
      // Changes boolean value "approved" to true, to use it after in index.hbs to see the publication
      await Publication.findByIdAndUpdate(
        publicationId,
        { approved: false },
        { new: true }
      );

      res.redirect("/admin/publications");
    } catch (error) {
      next(error);
    }
  }
);

// GET "/admin/publications/:publicationId/edit" => renders publications details page to edit it
router.get(
  "/publications/:publicationId/edit",
  isModeratorOrAdmin,
  async (req, res, next) => {
    const { publicationId } = req.params;

    try {
      const publicationToEdit = await Publication.findById(
        publicationId
      ).populate("user");

      res.render("publications/pending/edit.hbs", {
        publicationToEdit: publicationToEdit,
      });
    } catch (error) {
      next(error);
    }
  }
);

// POST "/admin/publications/:publicationId/edit" => edit current publication and redirects to pending list
router.post("/publications/:publicationId/edit", uploader.single("file"), async (req, res, next) => {
  const { publicationId } = req.params;
  const { title, content } = req.body;

  const publicationToUpdate = {
    title,
    content,
    file: req.file?.path,
    
  };

  try {
    await Publication.findByIdAndUpdate(publicationId, publicationToUpdate, {
      new: true,
    });

    res.redirect("/admin/publications");
  } catch (error) {
    next(error);
  }
});

// POST "/admin/publications/:publicationId/delete" => delete selected publication and redirects to pending list
router.post("/publications/:publicationId/delete", async (req, res, next) => {
  const { publicationId } = req.params;

  try {
    await Publication.findByIdAndDelete(publicationId);

    res.redirect("/admin/publications");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
