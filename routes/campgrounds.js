// REQUIRE STATEMENTS 
const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const {isLoggedIn, isAuthor, validateCampground} = require('../middleware');
const campground = require('../controller/campgrounds')
const multer = require('multer')
const {storage} = require('../cloudinary/index'); 
const upload = multer({storage})


// CAMPGROUND ROUTES
console.log("hi")

router.route('/')
    .get(catchAsync(campground.renderCampgroundIndex))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campground.createCampground));

router.get('/new', isLoggedIn, campground.renderNewCampground)

router.route('/:id')
    .get(catchAsync(campground.showCampgroundDetail))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campground.editCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campground.deleteCampground))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campground.renderEditCampground))

module.exports = router;