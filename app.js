// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");
// hbs.registerPartials(__dirname + "/views/partials") ------------------------------------------------------------

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

// default value for title local
const capitalize = require("./utils/capitalize");
const projectName = "IronWorld";

app.locals.appTitle = `${capitalize(projectName)} created with IronLauncher`;

// Middleware for boolean global variables - to execute in each client call to the server
app.use((req, res, next) => {
  // User online condition
  if (req.session.userOnline !== undefined) {
    res.locals.isUserActive = true;
    // Create a global variable to access user properties at any file
    res.locals.currentUser = req.session.userOnline;
    //console.log(req.session.userOnline);
    //console.log(res.locals.currentUser)
    if (
      req.session.userOnline.role === "admin" || req.session.userOnline.role === "moderator"
    ) {
      res.locals.isAdminOrModeratorOn = true;
      if (req.session.userOnline.role === "admin") {
        res.locals.isAdminOn = true;
      } else {
        res.locals.isAdminOn = false;
      }
    } else {
      res.locals.isAdminOrModeratorOn = false;
    }
  } else {
    res.locals.isUserActive = false;
  }

  // To pass to the next route
  next();
});

// 👇 Start handling routes here
const indexRoutes = require("./routes/index.routes");
app.use("/", indexRoutes);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
