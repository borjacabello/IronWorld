const express = require("express");
const router = express.Router();
const User = require("../models/User.model");

//* Authentication routes

// * Sign Up routes
// GET "/auth/signup" => Renders User Registration Form
router.get("/signup", (req, res, next) => {
  res.render("auth/signup.hbs");
});

// POST "/auth/signup" => Retrieves new user info from signup.hbs and creates the profile in the DB
router.post("/signup", async (req, res, next) => {
  const { username, email, password } = req.body;

  // Validation 1: All the fields must not be empty
  if (username === "" || email === "" || password === "") {
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
    if (foundEmail !== null) {
      res.render("auth/signup.hbs", {
        errorMessage: "Email has been already registered in the website.",
      });
      return;
    }

    // Validation 6: User doesn't already exists in the DB
    const foundUser = await User.find({ username: username });
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
      email: email,
      password: hashedPassword,
    };

    await User.create(newUser);

    res.redirect("/");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
