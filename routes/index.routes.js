const express = require('express');
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

// Auth routes
const authRoutes = require("./auth.routes")
router.use("/auth", authRoutes)

// Profile routes
const profileRoutes = require("./profile.routes")
router.use("/profile", profileRoutes)

// Export
module.exports = router;
