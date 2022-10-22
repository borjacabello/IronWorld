const express = require("express");
const router = express.Router();

const User = require("../models/User.model");

//! IMPORT MIDDLEWARES
const {
  isUserLoggedIn,
  isAdmin,
  isModeratorOrAdmin,
} = require("../middlewares/auth.middlewares.js");

// GET /profile => Renders user profile page
router.get("/", isUserLoggedIn, async (req, res, next) => {
  try {
    const userOnlineDetails = await User.findById(req.session.userOnline);
    res.render("profile/my-profile.hbs", {
      profileDetails: userOnlineDetails,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
