const express = require("express");
const campground = require("../models/campgrounds");
const catchAsync = require("../utils/catchAsync");
const campgrounds = require("../controllers/campgrounds");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage: storage });

const router = express.Router();

const { isLoggedIn, validateCampground, isAuthor } = require("../middleware");

router
  .route("/")
  .get(catchAsync(campgrounds.index))
  .post(
    isLoggedIn,
    upload.array("image"),
    validateCampground,
    catchAsync(campgrounds.createNewCampground)
  );

//view the form
router.get("/new", isLoggedIn, campgrounds.renderNewForm);

//show the details of all the campgroundss
router
  .route("/:id")
  .get(catchAsync(campgrounds.showCampgrounds))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validateCampground,

    catchAsync(campgrounds.editCampgrounds)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

//get route to show the edit page
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.showEditPage)
);

module.exports = router;
