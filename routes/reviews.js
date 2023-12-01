const express = require("express");
const router = express.Router({ mergeParams: true });
const reviews = require("../controllers/reviews");
const { isLoggedIn, isReviewAuthor } = require("../middleware");
const { validateReview } = require("../middleware");
const catchAsync = require("../utils/catchAsync");

//adding a review
router.post("/", isLoggedIn, validateReview, catchAsync(reviews.postReview));

//delete route for deleting a review
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviews.deleteReview)
);

module.exports = router;
