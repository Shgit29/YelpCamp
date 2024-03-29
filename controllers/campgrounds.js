const campground = require("../models/campgrounds");

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
  const camps = await campground.find({});
  res.render("campgrounds/index", { camps });
};

module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new");
};

module.exports.createNewCampground = async (req, res) => {
  const geoData = await geoCoder
    .forwardGeocode({
      query: req.body.campground.location,
      limit: 1,
    })
    .send();

  const Campground = new campground(req.body.campground);
  Campground.geometry = geoData.body.features[0].geometry;

  Campground.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));

  Campground.author = req.user._id;
  await Campground.save();
  console.log(Campground);

  req.flash("success", "successfully made a new campground");
  res.redirect(`/campgrounds/${Campground._id}`);
};

module.exports.showCampgrounds = async (req, res) => {
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
};

module.exports.showEditPage = async (req, res) => {
  const { id } = req.params;
  const Campground = await campground.findById(id);

  if (!Campground) {
    req.flash("error", "cannot find campground");
    return res.redirect("/campgrounds");
  }

  res.render("campgrounds/edit", { Campground });
};

module.exports.editCampgrounds = async (req, res) => {
  const { id } = req.params;

  const Campground = await campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  const imgs = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  Campground.images.push(...imgs);
  await Campground.save();

  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await Campground.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
    console.log(Campground);
  }

  req.flash("success", "successfully updated a campground");
  res.redirect(`/campgrounds/${Campground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  const deleted = await campground.findByIdAndDelete(id);
  req.flash("success", "successfully deleted a campground");
  res.redirect("/campgrounds");
};
