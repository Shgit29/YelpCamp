const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const User = require("../models/users");
const passport = require("passport");
const { storeReturnTo } = require("../middleware");

router.get("/register", (req, res) => {
  res.render("users/register");
});

router.post(
  "/register",
  catchAsync(async (req, res, next) => {
    try {
      const { email, username, password } = req.body;
      const newUser = new User({ email, username });
      const regUser = await User.register(newUser, password);
      req.login(regUser, (err) => {
        if (err) return next(err);
        req.flash("Welcome to yelpcamp");
        res.redirect("/campgrounds");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/register");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("users/login");
});

router.post(
  "/login",
  storeReturnTo,
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    req.flash("success", "Welcome back to yelpcamp");
    const redirectUrl = res.locals.returnTo || "/campgrounds";
    delete req.session.returnTo;
    console.log(redirectUrl);
    res.redirect(redirectUrl);
  }
);

// router.get("logout", (req, res) => {
//   req.logout();
//   req.flash("success", "Goodbye");
//   res.redirect("/campgrounds");
// });
router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Goodbye!");
    res.redirect("/campgrounds");
  });
});
module.exports = router;
