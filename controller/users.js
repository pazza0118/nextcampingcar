const User = require('../models/user')

module.exports.renderUserRegister = (req,res)=>{
    res.render('users/register')
}
module.exports.registerUser = async(req,res)=>{
    try{
        const {email, username, password} = req.body;
        const user = new User({email, username});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {              // I'm not too sure how, but this req.login(...) function seem to fill the user info into req.user 
            if(err){return next(err)}
            req.flash('success', 'Welcome to Yelpcamp');
            res.redirect('/campgrounds');    
        })
    }
    catch(e){
        req.flash('error', e.message)
        res.redirect('/register')
    }
}
module.exports.renderUserLogin = (req,res)=>{
    res.render('users/login')
}

module.exports.loginUser = async (req,res)=>{
    // at some point in passport.authenticate(...) -> this will find and authenticate a specific user in mongoDB -> now req.user contains the current user info
    req.flash('success', 'Welcome back')
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo; 
    res.redirect(redirectUrl);
}

module.exports.logoutUser = (req, res, next) => {
    req.logout(function(err) {
        if (err) { 
            return next(err); 
        }
        req.flash('success', "Goodbye!");
        res.redirect('/campgrounds');
    });
}