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
      .sort({createdAt: -1})
      .populate("user")
      .populate({ path: "comments", populate: { path: "user" } });

    const clonedPublications = JSON.parse(JSON.stringify(publications))

    clonedPublications.forEach(eachPublication => {
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

    // 10 job offers only to display at home page
    let jobOffers = jsonResponse.slice(0, 10)

    res.render("index.hbs", {
      clonedPublications,
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
router.use("/user", userRoutes);

// // * Discord routes
// const discordRoutes = require("./discord.routes");
// router.use("/discord", discordRoutes);

// * Export
module.exports = router;
