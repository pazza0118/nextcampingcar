
const Campground = require('./models/campground');
const Review = require('./models/review');
const expressError = require('./utils/expressError');
const {campgroundSchema, reviewSchema} = require('./schemas.js');

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'sign in first');
        return res.redirect('/login')
    } 
    next();
}
module.exports.isAuthor = async (req, res, next) => {
    const {id} = req.params   // So the id is the id of campground, and I guess req.params.id exists since the 
    const campground = await Campground.findById(id)
    if(!campground.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission to edit that');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}
module.exports.isAuthorReview = async (req, res, next) => {
    const {id, reviewId} = req.params   // So the id is the id of campground, and I guess req.params.id exists since the 
    const review = await Review.findById(reviewId)
    if(!review.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission to delete the review');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}
module.exports.validateCampground = (req,res,next) => {
    const {error} = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(element => element.message).join(',')
        throw new expressError(msg, 400)
    }else{
        next();
    }
}
// VALIDATION MIDDLEWARE 
module.exports.validateReview = (req,res,next) => {
    const {error} = reviewSchema.validate(req.body)
    if(error){
        const msg = error.details.map(element => element.message).join(',')
        throw new expressError(msg, 400)
    }else{
        next();
    }
}