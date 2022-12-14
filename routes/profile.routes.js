const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const Publication = require("../models/Publication.model");
const uploader = require("../middlewares/cloudinary.js");
const bcrypt = require("bcryptjs");

// Import middlewares
const {
  isUserLoggedIn,
  isAdmin,
  isModeratorOrAdmin,
} = require("../middlewares/auth.middlewares.js");

// *********************** PROFILE ROUTES *************************************
// GET /profile => Renders user profile page
router.get("/", isUserLoggedIn, async (req, res, next) => {
  try {
    const userOnlineDetails = await User.findById(
      req.session.userOnline
    ).populate("favourites");
    const publicationUserOnline = await Publication.find({
      user: userOnlineDetails,
    }).populate("user");

    const clonedPublicationUserOnline = JSON.parse(
      JSON.stringify(publicationUserOnline)
    );

    // Publications sorted by created date
    clonedPublicationUserOnline.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    // Publications date with timestamps reduce
    clonedPublicationUserOnline.forEach((eachPublication) => {
      eachPublication.createdAt = new Intl.DateTimeFormat("es-ES", {
        timeStyle: "medium",
        dateStyle: "short",
      }).format(new Date(eachPublication.createdAt));

      eachPublication.updatedAt = new Intl.DateTimeFormat("es-ES", {
        timeStyle: "medium",
        dateStyle: "short",
      }).format(new Date(eachPublication.updatedAt));
    });

    res.render("profile/my-profile.hbs", {
      profileDetails: userOnlineDetails,
      publicationUserOnline: clonedPublicationUserOnline,
    });
  } catch (error) {
    next(error);
  }
});

// GET /profile/edit => Renders user edit profile page
router.get("/edit", isUserLoggedIn, (req, res, next) => {
  res.render("profile/edit-profile.hbs", {
    userToEdit: req.session.userOnline,
  });
});

// POST /profile/edit => edit the profile page, and redirect to profile
router.post(
  "/edit",
  isUserLoggedIn,
  uploader.single("profileImage"),
  async (req, res, next) => {
    const { username, email, age } = req.body;

    // Validation 1: All the fields must not be empty
    if (username === "" || age === "" || email === "") {
      res.render("profile/edit-profile.hbs", {
        userToEdit: req.session.userOnline,
        errorMessage: "All the fields must be completed",
      });

      return;
    }

    // Validation 2: username should at least contain 4 characters
    if (username.length < 4) {
      res.render("profile/edit-profile.hbs", {
        userToEdit: req.session.userOnline,
        errorMessage: "Username must contain at least 4 characters",
      });

      return;
    }

    // Validation 3 : age value between 18 - 120
    if (age < 18 || age > 120) {
      res.render("profile/edit-profile.hbs", {
        userToEdit: req.session.userOnline,
        errorMessage: "Age must be between 18 to 120",
      });
    }

    try {
      //Validation 4: User doesn't already exists in the DB
      const foundUser = await User.findOne({ username: username });
      if (
        foundUser !== null &&
        foundUser.username !== req.session.userOnline.username
      ) {
        res.render("profile/edit-profile.hbs", {
          userToEdit: req.session.userOnline,
          errorMessage:
            "Username has been already registered in the website. Choose another",
        });

        return;
      }

      await User.findByIdAndUpdate(
        req.session.userOnline,
        {
          username,
          age,
          profileImage: req.file?.path,
        },
        { new: true }
      );
      res.redirect("/profile");
    } catch (error) {
      next(error);
    }
  }
);

// GET /profile/editpassword => Renders profile password edit page
router.get("/editpassword", isUserLoggedIn, async (req, res, next) => {
  try {
    res.render("profile/edit-password.hbs");
  } catch (error) {
    next;
  }
});

// POST /profile/editpassword => Renders profile password edit page
router.post("/editpassword", isUserLoggedIn, async (req, res, next) => {
  const { oldpassword, newpassword, repeatnewpassword } = req.body;

  // Validation 1: fields mustn't be empty
  if (oldpassword === "" || newpassword === "" || repeatnewpassword === "") {
    res.render("profile/edit-password.hbs", {
      errorMessage: "All the fields must be completed",
    });
    return;
  }

  // Validation 2: New passwords must be equal
  if (newpassword !== repeatnewpassword) {
    res.render("profile/edit-password.hbs", {
      errorMessage: "New paswords must be equal",
    });
    return;
  }

  // Validation 3: Password format validation
  const passwordFormat =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;
  if (!passwordFormat.test(newpassword)) {
    res.render("profile/edit-password.hbs", {
      errorMessage:
        "Password should have at least 8 characteres, an uppercase letter and a number",
    });

    return;
  }

  try {
    const foundUser = await User.findById(req.session.userOnline).select(
      "password"
    );

    // Validation 4: Compare userOnline Password with the password in hbsInput
    const validPassword = await bcrypt.compare(oldpassword, foundUser.password);
    if (validPassword === false) {
      res.render("profile/edit-password.hbs", {
        errorMessage: "Incorrect credentials",
      });
      return;
    } else if (validPassword === true && newpassword === repeatnewpassword) {
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(newpassword, salt);
      const x = await User.findByIdAndUpdate(foundUser, {
        password: hashedPassword,
      });

      res.redirect("/profile");
    }
  } catch (error) {
    next(error);
  }
});

// GET /profile/edit/email => Renders profile email edit page
router.get("/edit/email", isUserLoggedIn, (req, res, next) => {
  res.render("profile/edit-email.hbs");
});

// POST /profile/edit/email => Renders profile email edit page
router.post("/edit/email", isUserLoggedIn, async (req, res, next) => {
  const { oldemail, newemail, repeatemail } = req.body;


  // Validation 1: fields mustn't be empty
  if (oldemail === "" || newemail === "" || repeatemail === "") {
    res.render("profile/edit-email.hbs", {
      errorMessage: "All the fields must be completed",
    });
    return;
  }

  // Validation 2: New passwords must be equal
  if (newemail !== repeatemail) {
    res.render("profile/edit-email.hbs", {
      errorMessage: "new Emails must be equal",
    });
    return;
  }

  // Validation 3: Email format validation
   const emailFormat =
     /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;
   if (!emailFormat.test(newemail)) {
     res.render("profile/edit-email.hbs", {
       errorMessage: "Incorrect email format",
     });

     return;
   }

  try {

    // Validation 4: Email doesn't already exists in the DB
    const userEmail = await User.findOne({ email: oldemail }).select("email");
    
    if (userEmail !== null && userEmail.email !== req.session.userOnline.email) {
      res.render("profile/edit-email.hbs", {
        errorMessage: "Email has been already registered in the website.",
      });
      return;
    } else {

    const updatedEmail = await User.findByIdAndUpdate(req.session.userOnline, {email: newemail})
    res.redirect("/profile")
    }
  } catch (error) {
    next(error);
  }
});

// *********************** OWN PUBLICATIONS ROUTES *************************************
// GET "/profile/publications/:publicationId/details" => renders the details of each own publication
router.get(
  "/publications/:publicationId/details",
  isUserLoggedIn,
  async (req, res, next) => {
    const { publicationId } = req.params;

    try {
      const publicationDetails = await Publication.findById(
        publicationId
      ).populate("user");
        res.render("profile/publication-details.hbs", {
        publicationDetails: publicationDetails,
      });
    } catch (error) {
      next(error);
    }
  }
);

// POST "/profile/publications/:publicationId/delete" => deletes the current own publication
router.post(
  "/publications/:publicationId/delete",
  isUserLoggedIn,
  async (req, res, next) => {
    const { publicationId } = req.params;
   
    try {
      await Publication.findByIdAndDelete(publicationId);

      res.redirect("/profile");
    } catch (error) {
      next(error);
    }
  }
);

// GET "/profile/publications/:publicationId/edit" => renders profile own publication to edit
router.get(
  "/publications/:publicationId/edit",
  isUserLoggedIn,
  async (req, res, next) => {
    const { publicationId } = req.params;

    try {
      const ownPublicationToEdit = await Publication.findById(publicationId);
      res.render("profile/publication-edit.hbs", {
        ownPublicationToEdit: ownPublicationToEdit,
      });
    } catch (error) {
      next(error);
    }
  }
);

// POST "/profile/publications/:publicationId/edit" => renders profile own publication to edit
router.post(
  "/publications/:publicationId/edit",
  isUserLoggedIn,
  uploader.single("file"),
  async (req, res, next) => {
    const { publicationId } = req.params;
    const { title, content } = req.body;
    try {
      const ownPubEdited = await Publication.findByIdAndUpdate(publicationId, {
        title,
        content,
        file: req.file?.path,
      });
      res.redirect(`/profile/publications/${publicationId}/details`);
    } catch (error) {
      next(error);
    }
  }
);

// *********************** FAVOURITE PUBLICATIONS ROUTES *************************************
// POST "/profile/publications/:publicationId/favourite => add publication to UserOnline.favourite properties
router.post(
  "/publications/:publicationId/favourite",
  isUserLoggedIn,
  async (req, res, next) => {
    const { publicationId } = req.params;

    try {
      const currentPublication = await Publication.findById(publicationId);
      const userOnline = await User.findById(req.session.userOnline);
      const currentUser = await User.findByIdAndUpdate(userOnline, {
        $addToSet: { favourites: currentPublication },
      })
        .populate("publications")
        .select("username favourites");

      res.redirect("/");
    } catch (error) {
      next(error);
    }
  }
);

// POST "/profile/publications/:publicationId/favouritedelete => add publication to UserOnline.favourite properties
router.post(
  "/publications/:publicationId/favouritedelete",
  isUserLoggedIn,
  async (req, res, next) => {
    const { publicationId } = req.params;

    try {
      const currentPublication = await Publication.findById(publicationId);
      const userOnline = await User.findById(req.session.userOnline);
      const currentUser = await User.findByIdAndUpdate(userOnline, {
        $pull: { favourites: publicationId },
      }).select("username favourites");    

      res.redirect("/profile");
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
