const mongoose = require('mongoose');
const Review = require('./review');
const passport = require('passport')
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    url: String,
    fileName: String
})
imageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_200');
})

const opts = {toJSON: {virtuals: true}};
const campgroundSchema = new Schema({
    title: String,
    images: [imageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, opts);
campgroundSchema.virtual('properties.popupText').get(function(){
    // return 'popup text';
    return `
    <a href="/campgrounds/${this._id}">${this.title}</a>
    <p>${this.description.substring(0,30)}...</p>
    `;
})
campgroundSchema.post('findOneAndDelete', async function(campground){
    if(campground){
        await Review.deleteMany({_id: {$in:campground.reviews}})
    }
})

module.exports = mongoose.model('Campground', campgroundSchema);