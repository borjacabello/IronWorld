const express = require('express');
const router = express.Router();
const User = require("../models/User.model");
const Publication = require("../models/Publication.model");
const Comment = require("../models/Comment.model")



/* GET home page */
router.get("/", async (req, res, next) => {

  try {
    const publications = await Publication.find().populate("user").populate("comments")
    //const comments = await Comment.find().populate("publication")
    
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
