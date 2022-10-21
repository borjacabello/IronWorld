const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");

//* Authentication routes

// * Sign Up routes
// GET "/auth/signup" => Renders User Registration Form
router.get("/signup", (req, res, next) => {
  res.render("auth/signup.hbs");
});

// POST "/auth/signup" => Retrieves new user info from signup.hbs and creates the profile in the DB
router.post("/signup", async (req, res, next) => {
  const { username, age, email, password } = req.body;

  // Validation 1: All the fields must not be empty
  if (username === "" || age === "" || email === "" || password === "") {
    res.render("auth/signup.hbs", {
      errorMessage: "All the fields must be completed",
    });
    return;
  }

  // Validation 2: username should at least contain 4 characters
  if (username.length < 4) {
    res.render("auth/signup.hbs", {
      errorMessage: "Username must contain at least 4 characters",
    });
    return;
  }

  // Validation 3: Email format validation
  const emailFormat =
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;
  if (!emailFormat.test(email)) {
    res.render("auth/signup.hbs", {
      errorMessage: "Incorrect email format",
    });
    return;
  }

  // Validation 4: Password format validation
  const passwordFormat =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;
  if (!passwordFormat.test(password)) {
    res.render("auth/signup.hbs", {
      errorMessage:
        "Password should have at least 8 characteres, an uppercase letter and a number",
    });
    return;
  }

  // Async
  try {
    // Validation 5: Email doesn't already exists in the DB
    const foundEmail = await User.findOne({ email: email });
    console.log(foundEmail);
    if (foundEmail !== null) {
      res.render("auth/signup.hbs", {
        errorMessage: "Email has been already registered in the website.",
      });
      return;
    }

    // Validation 6: User doesn't already exists in the DB
    const foundUser = await User.findOne({ username: username });
    if (foundUser !== null) {
      res.render("auth/signup.hbs", {
        errorMessage: "Username has been already registered in the website.",
      });
      return;
    }

    // Password Encrypting
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Add new user to the DB
    const newUser = {
      username: username,
      age: age,
      email: email,
      password: hashedPassword,
    };

    await User.create(newUser);

    res.redirect("/");
  } catch (error) {
    next(error);
  }
});


// * Log In routes

// GET /auth/login => Renders user login page
router.get("/login", (req, res, next) => {
    res.render("auth/login.hbs")
})

// POST /auth/login => Receives user credentials and validate user
router.post("/login", async (req, res, next) => {
    const { email, password } = req.body;
  
    // Validation 1: fields mustn't be empty
    if (email === "" || password === "") {
      res.render("auth/login.hbs", {
        errorMessage: "All the fields must be completed",
      });
      return;
    }
  
    try {
      // Validation 2: User is already registered in the DB
      const foundUser = await User.findOne({ email: email });
      if (foundUser === null) {
        res.render("auth/login.hbs", {
          errorMessage: "Incorrect credentials",
        });
        return;
      }
  
      // Validation 3: Password is already registered in the DB
      const validPassword = await bcrypt.compare(password, foundUser.password);
      if (validPassword === false) {
        res.render("auth/login.hbs", {
          errorMessage: "Incorrect credentials",
        });
        return;
      }
  
      // Create an active user session
      req.session.userOnline = foundUser;
  
      // Verifying that the session has been successfully created
      req.session.save(() => {
        res.redirect("/");
      });
    } catch (error) {
      next(error);
    }
  });


//* Log Out route
// GET "/auth/logout" => closes the current user session (destroy)
router.get("/logout", (req, res, next) => {

  req.session.destroy(() => {
    res.redirect("/")
  })

})

module.exports = router;
