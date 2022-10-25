const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const Publication = require("../models/Publication.model");
const Comment = require("../models/Comment.model");
const fetch = require('node-fetch');

/* GET home page */
router.get("/", async (req, res, next) => {
  try {
    // Use populate({path: "id"}) to populate the users inside each comment in the publication
    const publications = await Publication.find()
      .populate("user")
      .populate({ path: "comments", populate: { path: "user" } });


    // Comments
    const userOnlineDetails = await User.findById(req.session.userOnline);
    const userOnlineComments = await Comment.find({user: userOnlineDetails}).populate("user")

    for (let comment of userOnlineComments) {
      if (comment.user._id.toString() === req.session.userOnline._id) {
        await Comment.findByIdAndUpdate(comment._id, {show: true}, {new: true})
      }
    }

    // API jobs
    const url = 'https://tech-job-search-api.p.rapidapi.com/';
    const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': '629f5312dbmsha3e0cb11c09ab80p105c68jsnf9ebe00c013a',
        'X-RapidAPI-Host': 'tech-job-search-api.p.rapidapi.com'
    }
    };

    const response = await fetch(url, options)
    const jsonResponse = await response.json()

    console.log(jsonResponse);

    let jobOffers = jsonResponse.slice(0, 10)

    res.render("index.hbs", {
      publications,
      jobOffers
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
const { config } = require("dotenv");
const { setDriver } = require("mongoose");
router.use("/user", userRoutes);

// * Indeed routes
const indeedRoutes = require("./indeed.routes");
router.use("/indeed", indeedRoutes);

// * Discord routes
const discordRoutes = require("./discord.routes");
router.use("/discord", discordRoutes);

// * Export
module.exports = router;
