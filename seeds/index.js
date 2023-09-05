const campground = require("../models/campgrounds");
const city = require("./cities");
const mongoose = require("mongoose");
const { descriptors, places } = require("./seedhelpers");

mongoose
  .connect(
    "mongodb://127.0.0.1:27017/yelp-camp",
    { useNewUrlParser: true },
    { useUnifiedTopology: true }
  )
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
    const price = Math.floor(Math.random() * 20) + 10;
    const camper = new campground({
      location: `${city[random1000].city},${city[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: "https://source.unsplash.com/collection/2184453",
      description:
        "lorem ipsum dolor sit amet conefnasdnfsadiuahsndfiujahndionsa nisjdoaisdj  ijasdoijas  oiajsdoiasjd oijasoidj asdij oaisjd  oijas dfioj",
      price,
    });

    await camper.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
