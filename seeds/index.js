const mongoose = require('mongoose')
const Campground = require('../models/campground')
const cities = require('./cities')
const {descriptors, places} = require('./seedHelpers')
mongoose.connect('mongodb://localhost:27017/yelpCamp',{
    useNewUrlParser: true,                  // handles deprecation
    useUnifiedTopology: true
}).catch(error => console.log(error))       // handles error at initial connection
mongoose.connection.on('error', err=>{      // handles error after initial connection - continuous check
    console.log(err)
})
mongoose.connection.once("open", ()=>{      // states when db connection is open - once only 
    console.log("database yelpcamp connencted")
})
const selectCity = () => {
    return cities[Math.floor(Math.random() * 1000)]
}
const selectHelper = (array) => {
    return array[Math.floor(Math.random() * array.length)]
}
const selectPrice = () => {
    return Math.floor(Math.random() * 20)
}
const seedDB = async () =>{
    await Campground.deleteMany({});
    for(let i = 0; i < 200; i++){
        
        const camp = new Campground({
            title: `${selectHelper(descriptors)} - ${selectHelper(places)}`,
            geometry: {
                type: "Point",
                coordinates: [`${selectCity().longitude}`, `${selectCity().latitude}`]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dytfoucya/image/upload/v1660491019/YelpCamp/ja7ybq543i9uclgqoica.jpg',
                    fileName: 'YelpCamp/ja7ybq543i9uclgqoica'
                },
                {
                    url: 'https://res.cloudinary.com/dytfoucya/image/upload/v1660491049/YelpCamp/cqae6va5ywgz1a9iisai.jpg',
                    fileName: 'YelpCamp/cqae6va5ywgz1a9iisai'
                }
            ],
            location: `${selectCity().city} - ${selectCity().state}`,
            price: selectPrice(),
            description: 'sample description sample description sample description sample description sample description',
            author: '62f126b60981fb5fb0ce2ed3' 
        })
        await camp.save();    
    }
}
seedDB().then(()=>{
    mongoose.connection.close();
});