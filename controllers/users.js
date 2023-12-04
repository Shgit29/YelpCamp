const User = require("../models/users");
const passport = require("passport");
const { storeReturnTo } = require("../middleware");

module.exports.renderRegister = (req, res) => {
  res.render("users/register");
};

module.exports.registerUser = async (req, res, next) => {
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
};

module.exports.renderLogin = (req, res) => {
  res.render("users/login");
};

module.exports.loginUser = passport.authenticate("local", {
  failureFlash: true,
  failureRedirect: "/login",
}),
  (req, res) => {
    req.flash("success", "Welcome back to yelpcamp");
    console.log(res.locals.returnTo);
    const redirectUrl = res.locals.returnTo || "/campgrounds";
    delete req.session.returnTo;
    console.log(redirectUrl);
    res.redirect(redirectUrl);
  };

module.exports.logoutUser = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Goodbye!");
    res.redirect("/campgrounds");
  });
};
