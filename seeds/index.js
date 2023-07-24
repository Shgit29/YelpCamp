const campground = require("../models/campgrounds");
const city = require("./cities");
const mongoose = require("mongoose");
const { descriptors, places } = require("./seedhelpers");

mongoose
  .connect("mongodb://127.0.0.1:27017/yelp-camp")
  .then(() => {
    console.log("mongo connection working");
  })
  .catch((error) => {
    console.log("mongo conection error: ", error);
  });

const sample = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

// console.log(`${sample(descriptors)}`);

/**
 *
 * seeding functin for adding data to the database
 */
const seedDB = async () => {
  await campground.deleteMany({});

  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const camper = new campground({
      location: `${city[random1000].city},${city[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
    });

    await camper.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
