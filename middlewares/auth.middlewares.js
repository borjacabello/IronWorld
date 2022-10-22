//* Authorisation middlewares

// Log In middleware => to theck log in condition
const isUserLoggedIn = (req, res, next) => {
    if (req.session.userOnline === undefined) {
        res.redirect("/auth/login")
    } else {
        next()
    }
}

// Admin middleware => to check admin user condition
const isAdmin = (req, res, next) => {
    if (req.session.userOnline.role !== "admin") {
        res.redirect("/auth/login")
    } else {
        next()
    }
}

// Moderator middleware => to check moderadtor user condition
const isModeratorOrAdmin = (req, res, next) => {
    if (req.session.userOnline.role !== "moderator" || req.session.userOnline.role !== "admin") {
        res.redirect("/auth/login")
    } else {
        next()
    }
}

// Exports
module.exports = {
    isUserLoggedIn,
    isAdmin,
    isModeratorOrAdmin
}

