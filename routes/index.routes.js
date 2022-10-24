const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const Publication = require("../models/Publication.model");
const Comment = require("../models/Comment.model");

/* GET home page */
router.get("/", async (req, res, next) => {
  try {
    // Use populate({path: "id"}) to populate the users inside each comment in the publication
    const publications = await Publication.find()
      .populate("user")
      .populate({ path: "comments", populate: { path: "user" } });

    res.render("index", {
      publications,
    });
  } catch (error) {
    next(error);
  }
});

// * Auth routes
const authRoutes = require("./auth.routes");
router.use("/auth", authRoutes);

// * Profile routes
const profileRoutes = require("./profile.routes");
router.use("/profile", profileRoutes);

// * Admin routes
const adminRoutes = require("./admin.routes");
router.use("/admin", adminRoutes);

// * User routes
const userRoutes = require("./user.routes");
router.use("/user", userRoutes);

// * Indeed routes
const indeedRoutes = require("./indeed.routes");
router.use("/indeed", indeedRoutes);

// * Discord routes
const discordRoutes = require("./discord.routes");
router.use("/discord", discordRoutes);

// * Export
module.exports = router;
