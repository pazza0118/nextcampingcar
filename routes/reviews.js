// REQUIRE STATEMENTS 
const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync');
const expressError = require('../utils/expressError');
const Review = require('../models/review')
const Campground = require('../models/campground');
const {validateReview, isLoggedIn, isAuthorReview} = require('../middleware')
const review = require('../controller/reviews')

// REVIEW ROUTES
router.post('/', isLoggedIn, validateReview, review.createReview);
router.delete('/:reviewId', isLoggedIn, isAuthorReview, catchAsync(review.deleteReview))

module.exports = router;