const express = require("express");
const campground = require("../models/campgrounds");
const catchAsync = require("../utils/catchAsync");

const router = express.Router();

const { isLoggedIn, validateCampground, isAuthor } = require("../middleware");

// index route for showing the campgrounds
router.get(
  "/",

  catchAsync(async (req, res) => {
    const camps = await campground.find({});
    res.render("campgrounds/index", { camps });
  })
);

//view the form
router.get("/new", isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

//for submitting the form
router.post(
  "/",
  isLoggedIn,
  validateCampground,
  catchAsync(async (req, res) => {
    const Campground = new campground(req.body.campground);

    Campground.author = req.user._id;
    await Campground.save();
    req.flash("success", "successfully made a new campground");
    res.redirect(`/campgrounds/${Campground._id}`);
  })
);

//show the details of all the campgroundss
router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const Campground = await campground
      .findById(req.params.id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("author");

    if (!Campground) {
      req.flash("error", "cannot find campground");
      return res.redirect("/campgrounds");
    } else {
      res.render("campgrounds/show", { Campground });
    }
  })
);

//get route to show the edit page
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const Campground = await campground.findById(id);

    if (!Campground) {
      req.flash("error", "cannot find campground");
      return res.redirect("/campgrounds");
    }

    res.render("campgrounds/edit", { Campground });
  })
);

//put route
router.put(
  "/:id",
  isLoggedIn,
  validateCampground,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;

    const Campground = await campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    req.flash("success", "successfully updated a campground");
    res.redirect(`/campgrounds/${Campground._id}`);
  })
);

//delete route for campground

router.delete(
  "/:id",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const deleted = await campground.findByIdAndDelete(id);
    req.flash("success", "successfully deleted a campground");
    res.redirect("/campgrounds");
  })
);

module.exports = router;
