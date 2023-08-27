const express = require("express");
const app = express();
const path = require("path");
const campground = require("./models/campgrounds");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const catchAsync = require("./utils/catchAsync");
const { campgroundSchema } = require("./schemas.js");

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

mongoose
  .connect("mongodb://127.0.0.1:27017/yelp-camp")
  .then(() => {
    console.log("mongo connection working");
  })
  .catch((error) => {
    console.log("mongo conection error: ", error);
  });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const validateCampground = (req, res, next) => {
  try {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
      const msg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(msg, 400);
    } else {
      next();
    }
  } catch {
    throw new ExpressError(" validateCampground function not working");
  }
};

// index route for showing the campgrounds
app.get(
  "/campgrounds",
  catchAsync(async (req, res) => {
    const camps = await campground.find({});
    res.render("campgrounds/index", { camps });
  })
);

//view the form
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

//for submitting the form
app.post(
  "/campgrounds",
  validateCampground,
  catchAsync(async (req, res) => {
    // if (!req.body.campground)
    //   throw new ExpressError("Invlaid campground data", 400);

    const Campground = new campground(req.body.campground);
    console.log(req.body.campground);
    await Campground.save();
    res.redirect(`/campgrounds/${Campground._id}`);
  })
);

//show the details of all the campgroundss
app.get(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const Campground = await campground.findById(req.params.id);
    res.render("campgrounds/show", { Campground });
  })
);

//get route to show the edit page
app.get(
  "/campgrounds/:id/edit",
  catchAsync(async (req, res) => {
    const Campground = await campground.findById(req.params.id);
    res.render("campgrounds/edit", { Campground });
  })
);

//put route
app.put(
  "/campgrounds/:id",
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const Campground = await campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });

    res.redirect(`/campgrounds/${Campground._id}`);
  })
);

app.delete(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const deleted = await campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
  })
);

app.all("*", (req, res, next) => {
  next(new ExpressError("Page not found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;

  if (!err.message) {
    err.message = "oh no, something went wrong";
  }

  res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
  console.log("serving on port 3000...");
});
