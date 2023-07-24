const express = require("express");
const app = express();
const path = require("path");
const campground = require("./models/campgrounds");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const campgrounds = require("./models/campgrounds");

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

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

// app.get("/", (req, res) => {
//   //   res.send("hello");
//   res.render("home");
// });

// index route for showing the campgrounds
app.get("/campgrounds", async (req, res) => {
  const camps = await campground.find({});
  res.render("campgrounds/index", { camps });
});

//view the form
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

//for submitting the form
app.post("/campgrounds", async (req, res) => {
  const Campground = new campground(req.body.campground);
  await Campground.save();
  res.redirect(`/campgrounds/${Campground._id}`);
});

//show the details of all the campgroundss
app.get("/campgrounds/:id", async (req, res) => {
  const Campground = await campground.findById(req.params.id);
  res.render("campgrounds/show", { Campground });
});

//get route to show the edit page
app.get("/campgrounds/:id/edit", async (req, res) => {
  const Campground = await campground.findById(req.params.id);
  res.render("campgrounds/edit", { Campground });
});

//put route
app.put("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  const Campground = await campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });

  res.redirect(`/campgrounds/${Campground._id}`);
});

app.delete("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  const deleted = await campground.findByIdAndDelete(id);
  res.redirect("/campgrounds");
});

app.listen(3000, () => {
  console.log("serving on port 3000...");
});
