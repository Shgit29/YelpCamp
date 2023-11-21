const campground = require("../models/campgrounds");

module.exports.index = async (req, res) => {
  const camps = await campground.find({});
  res.render("campgrounds/index", { camps });
};

module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new");
};

module.exports.createNewCampground = async (req, res) => {
  const Campground = new campground(req.body.campground);

  Campground.author = req.user._id;
  await Campground.save();
  req.flash("success", "successfully made a new campground");
  res.redirect(`/campgrounds/${Campground._id}`);
};
