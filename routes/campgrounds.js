const express = require("express");
const campground = require("../models/campgrounds");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const router = express.Router();
const { campgroundSchema } = require("../schemas.js");

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
// index route for showing the campgrounds
router.get(
  "/",
  catchAsync(async (req, res) => {
    const camps = await campground.find({});
    res.render("campgrounds/index", { camps });
  })
);

//view the form
router.get("/new", (req, res) => {
  res.render("campgrounds/new");
});

//for submitting the form
router.post(
  "/",
  validateCampground,
  catchAsync(async (req, res) => {
    // if (!req.body.campground)
    //   throw new ExpressError("Invlaid campground data", 400);

    const Campground = new campground(req.body.campground);
    // console.log(req.body.campground);
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
      .populate("reviews");

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
  catchAsync(async (req, res) => {
    const Campground = await campground.findById(req.params.id);
    res.render("campgrounds/edit", { Campground });
  })
);

//put route
router.put(
  "/:id",
  validateCampground,
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
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const deleted = await campground.findByIdAndDelete(id);
    req.flash("success", "successfully deleted a campground");
    res.redirect("/campgrounds");
  })
);

module.exports = router;
