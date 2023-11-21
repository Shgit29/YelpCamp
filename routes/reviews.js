const express = require("express");
const router = express.Router({ mergeParams: true });

const Review = require("../models/review.js");
const campground = require("../models/campgrounds");
const { isLoggedIn, isReviewAuthor } = require("../middleware");

const { validateReview } = require("../middleware");

const catchAsync = require("../utils/catchAsync");

router.post(
  "/",
  
  isLoggedIn,
  validateReview,
  catchAsync(async (req, res) => {
    const Campground = await campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
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
  isLoggedIn,
  isReviewAuthor,
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "successfully deleted a review");
    res.redirect(`/campgrounds/${id}`);
  })
);

module.exports = router;
