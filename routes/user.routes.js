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


//* Publication and comment creation routes
// POST "/user/publication/create" => creates a new publication for a user in the DB
router.post("/publication/create", isUserLoggedIn, async (req, res, next) => {
    const {title, content, file} = req.body

    const newPublication = {
        title,
        content,
        file,
        user: req.session.userOnline
        //user: res.locals.currentUser also works
    }

    try {
        await Publication.create(newPublication)

        res.redirect("/")
    } catch(error) {
        next(error)
    }
})

module.exports = router;