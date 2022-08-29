const Campground = require('../models/campground');
const Review = require('../models/review')

module.exports.createReview = async (req,res)=>{
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review)
    review.author = req.user._id;
    campground.reviews.push(review)
    await campground.save();
    await review.save();
    req.flash('success','successfully created review')
    res.redirect(`/campgrounds/${campground._id}`)    
}
module.exports.deleteReview = async(req,res)=>{
    const {id, reviewId} = req.params   // So the id is the id of campground, and I guess req.params.id exists since the 
    // route url is /campgrounds/:id/reviews/:reviewId) 
await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
await Review.findByIdAndDelete(reviewId)
req.flash('success','successfully deleted review')
res.redirect(`/campgrounds/${id}`)
}
