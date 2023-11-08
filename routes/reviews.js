const express = require("express");
const router = express.Router({ mergeParams: true });

const Review = require("../models/review.js");
const campground = require("../models/campgrounds");

const { reviewSchema } = require("../schemas.js");

const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);

  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.post(
  "/",
  validateReview,
  catchAsync(async (req, res) => {
    const Campground = await campground.findByIdAndUpdate(req.params.id);
    const review = new Review(req.body.review);
    Campground.reviews.push(review);
    await review.save();
    await Campground.save();
    req.flash("success", "successfully added a review");
    res.redirect(`/campgrounds/${Campground._id}`);
  })
);

//delete route for deleting a review
router.delete(
  "/:reviewId",
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "successfully deleted a review");
    res.redirect(`/campgrounds/${id}`);
  })
);

module.exports = router;
