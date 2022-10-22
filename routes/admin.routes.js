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



//* User management routes
// GET "/admin/users" => renders the user list only for admin management purposes
router.get("/users", isAdmin, async (req, res, next) => {
  try {
    const userList = await User.find();

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

    res.render("users/details.hbs", {
      userDetails,
    });
  } catch (error) {
    next(error);
  }
});

// POST "/admin/users/:userId/edit" => updates user parameters and redirects to user list
router.post("/users/:userId/edit", isAdmin, async (req, res, next) => {
    const {userId} = req.params;

    const {profileImage, username, age, email, role, links} = req.body

    const userToUpdate = {
        profileImage,
        username,
        age,
        email,
        role,
        links
    }

    try {
        await User.findByIdAndUpdate(userId, userToUpdate, {new: true})

        res.redirect("/admin/users")
    } catch(error) {
        next(error)
    }
})

// POST "/admin/users/:userId/delete" => deletes user from user list and redirects to user list
router.post("/users/:userId/delete", isAdmin, async (req, res, next) => {
    const {userId} = req.params

    try {
        await User.findByIdAndDelete(userId)

        res.redirect("/admin/users")
    } catch(error) {
        next(error)
    }
})


//* Publication management routes
// GET "/admin/publications" => renders publication list for both moderator and admin
router.get("/publications", isModeratorOrAdmin, async (req, res, next) => {
  try {
    const publicationList = await Publication.find()

    res.render("publications/list.hbs", {
      publicationList
    })
  } catch(error) {
    next(error)
  }
})

// POST "/admin/publications/:publicationId/approval" => approves current publication to be added to the index page list
router.post("/publications/:publicationId/approval", isModeratorOrAdmin, async (req, res, next) => {
  const {publicationId} = req.params
  
  try {
    // Changes boolean value "approved" to true, to use it after in index.hbs to see the publication
    const publicationToApprove = await Publication.findByIdAndUpdate(publicationId, {approved: true}, {new: true})
    console.log(publicationToApprove)

    res.redirect("/")

  } catch(error) {
    next(error)
  }
})


module.exports = router;
