const express = require('express');
const router = express.Router();
const Publication = require("../models/Publication.model");


/* GET home page */
router.get("/", async (req, res, next) => {

  try {
    const publications = await Publication.find().populate("user")

    res.render("index", {
      publications
    });

  } catch(error) {
    next(error)
  }
 
});

// Auth routes
const authRoutes = require("./auth.routes")
router.use("/auth", authRoutes)

// Profile routes
const profileRoutes = require("./profile.routes")
router.use("/profile", profileRoutes)

// Admin routes
const adminRoutes = require("./admin.routes")
router.use("/admin", adminRoutes)

// User routes
const userRoutes = require("./user.routes")
router.use("/user", userRoutes)


// Export
module.exports = router;
