const mongoose = require('mongoose')
const Campground = require('../models/campground')
const User = require('../models/user')
const cities = require('./cities')
const { descriptors, places } = require('./seedHelpers')
const images = require('./images')
require('dotenv').config();

console.log(process.env.DB_URL)
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/yelpCamp";


mongoose.connect(dbUrl, {
  useNewUrlParser: true,                  // handles deprecation
  useUnifiedTopology: true
}).catch(error => console.log(error))       // handles error at initial connection
mongoose.connection.on('error', err => {      // handles error after initial connection - continuous check
  console.log(err)
})
mongoose.connection.once("open", () => {      // states when db connection is open - once only 
  console.log("database yelpcamp connencted")
})

const selectCity = () => {
  return cities[Math.floor(Math.random() * 1000)]
}
const selectPrice = () => {
  return Math.floor(Math.random() * 20)
}
const selectImage = () => {
  return Math.floor(Math.random() * 25)
}
const selectHelper = (array) => {
  return array[Math.floor(Math.random() * array.length)]
}

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 100; i++) {
    const camp = new Campground({
      title: `${selectHelper(descriptors)} - ${selectHelper(places)}`,
      geometry: {
        type: "Point",
        coordinates: [`${selectCity().longitude}`, `${selectCity().latitude}`]
      },
      images: [ images[selectImage()], images[selectImage()] ],
      location: `${selectCity().city} - ${selectCity().state}`,
      price: selectPrice(),
      description: 'Provincial Campground',
      author: '63ce3cd6420caa6e142182a5'
    })
    await camp.save();
  }
}
seedDB().then(() => {
  mongoose.connection.close();
});