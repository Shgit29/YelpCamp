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
      author: "654e6d4e807eed33ada028db",
      location: `${city[random1000].city},${city[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,

      description:
        "lorem ipsum dolor sit amet conefnasdnfsadiuahsndfiujahndionsa nisjdoaisdj  ijasdoijas  oiajsdoiasjd oijasoidj asdij oaisjd  oijas dfioj",
      price,
      images: [
        {
          url: "https://res.cloudinary.com/deohtndpz/image/upload/v1701861380/YelpCamp/vt0kkp1ihomrosslayxi.webp",
          filename: "YelpCamp/vt0kkp1ihomrosslayxi",
          
        },
        {
          url: "https://res.cloudinary.com/deohtndpz/image/upload/v1701861380/YelpCamp/ozxjatjogbsn3mgqcgc8.jpg",
          filename: "YelpCamp/ozxjatjogbsn3mgqcgc8",
          
        },
        {
          url: "https://res.cloudinary.com/deohtndpz/image/upload/v1701861380/YelpCamp/wwcernqfw9jwbmjndzkk.jpg",
          filename: "YelpCamp/wwcernqfw9jwbmjndzkk",
          
        },
      ],
    });

    await camper.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
