const Campground = require('../models/campground');
const {cloudinary} = require('../cloudinary');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const campground = require('../models/campground');
const geocoder = mbxGeocoding({accessToken: mapBoxToken});

module.exports.renderCampgroundIndex = async(req,res)=>{
    const campgrounds = await Campground.find({})
    // console.log(campgrounds)
    // res.send('temp fix');
    res.render('campgrounds/index', {campgrounds})
}
module.exports.renderNewCampground = (req,res)=>{
    res.render('campgrounds/new')
}
module.exports.createCampground = async(req,res,next)=>{
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send();
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    console.log(campground.geometry)
    campground.images = req.files.map(f => ({url: f.path, fileName: f.filename}))
    campground.author = req.user._id;
    console.log(`req.files is: ${req.files}`)
    await campground.save(); 
    req.flash('success','successfully created campground')
    res.redirect(`/campgrounds/${campground._id}`)    
}
module.exports.showCampgroundDetail = async(req,res)=>{
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if(!campground){
        req.flash('error','error, cannot find campground')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/detail', {campground})
}
module.exports.renderEditCampground = async(req,res)=>{
    const campground = await Campground.findById(req.params.id);
    if(!campground){
        req.flash('error', 'There is no campground with that ID');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', {campground})
}
module.exports.editCampground = async(req,res,next)=>{
    console.log(req.body)
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id, req.body.campground); 
    const imgs = req.files.map(f => ({url: f.path, fileName: f.filename}));
    campground.images.push(...imgs);    // cannot push an array into another, need to spread the array using '...' to push in just the data
    await campground.save();
    if(req.body.deleteImages){
        for(let fileName of req.body.deleteImages){
            await cloudinary.uploader.destroy(fileName);
        }
        // pull from images array, all images with the fileName that is inside req.body.deleteImages array
        await campground.updateOne({ $pull: {images: {fileName: {$in: req.body.deleteImages}}}});
    }

    req.flash('success','successfully edited campground')
    res.redirect(`/campgrounds/${campground._id}`)
}
module.exports.deleteCampground = async(req,res)=>{
    await Campground.findByIdAndDelete(req.params.id)
    req.flash('success','successfully deleted campground')
    res.redirect('/campgrounds')
}