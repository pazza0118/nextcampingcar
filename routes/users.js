const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync');
const expressError = require('../utils/expressError');
const user = require('../controller/users')
const passport = require('passport')

// USER ROUTES
router.route('/register')
    .get(user.renderUserRegister)
    .post(catchAsync(user.registerUser));
router.route('/login')
    .get(user.renderUserLogin)
    .post(passport.authenticate('local',{failureFlash: true, failureRedirect: '/login', keepSessionInfo: true}), user.loginUser);
router.get('/logout', user.logoutUser); 

module.exports = router