const express = require('express');
const router = express.Router();
const User = require("../models/User.model")

//* Authentication routes

// * Sign Up routes
// GET "/auth/signup" => Renders User Registration Form
router.get("/signup", (req, res, next) => {
    res.render("auth/signup.hbs")
})

// POST "/auth/signup" => Retrieves new user info from signup.hbs and creates the profile in the DB



module.exports = router;