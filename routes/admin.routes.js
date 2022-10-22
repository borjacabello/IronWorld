const express = require("express");
const router = express.Router();
const User = require("../models/User.model");

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

//* Publication management routes

module.exports = router;
