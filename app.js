if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

// REQUIRE STATEMENTS 
const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const { nextTick } = require('process')
const expressError = require('./utils/expressError');
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
// const dbUrl = process.env.DB_URL
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/yelpCamp";
const session = require('express-session')
const MongoDBStore = require('connect-mongo');

// ROUTE SETUP
const campgroundRoutes = require('./routes/campgrounds')
const reviewRoutes = require('./routes/reviews')
const userRoutes = require('./routes/users')

const secret = process.env.SECRET || "secretmessage"

// Mongo SETUP
const store = MongoDBStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret
    }
});
store.on("error", function(e){
    console.log("SESSION STORE ERROR", e)
})
// SESSION SETUP
const sessionConfig = {
    store,
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        name: session,      // usually cookie info gets stored in connect.sid, with the name set to 'session', the cookie will now be stored there
        httpOnly: true,     // Sets cookie set via session as only accessible in http, so a malicious js script will not be able to access the cookie info 
        // secure: true,     // Cookie only works over https (http secured)
        expires: Date.now() + 1000*60*60*24*7,   // expires a week later
        maxAge: 1000*60*60*24*7                 // maxAge is one week
    }
}

// MONGOOSE DB SERVER CONNECTION
mongoose.connect(dbUrl, {
    useNewUrlParser: true,                  // handles deprecation
    useUnifiedTopology: true,
    // useCreateIndex: true,                // outdated
    // useFindAndModify: false
}).catch(error => console.log(error))       // handles error at initial connection
mongoose.connection.on('error', err=>{      // handles error after initial connection - continuous check
    console.log(err)
})
mongoose.connection.once("open", ()=>{      // states when db connection is open - once only 
    console.log("database yelpcamp connencted")
})

const app = express()
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))
app.use(mongoSanitize());


app.engine('ejs', ejsMate)

// STATIC ASSET
app.use(express.static(path.join(__dirname, 'public')))
// SESSION
app.use(session(sessionConfig))

// FLASH & res.locals
app.use(flash())


// HELMET SETUP
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net"
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net"
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/"
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dytfoucya/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);
// PASSPORT CONFIGURATION
app.use(passport.initialize())      // initializes passport
app.use(passport.session())         // to have persistent login session (so we don't log in for every new request)
passport.use(new LocalStrategy(User.authenticate()));   // passport will use localstrategy (from above)
                                                        // localstrategy will use authenticate method from User model for authentication
passport.serializeUser(User.serializeUser())            // telling passport how to serialize user
passport.deserializeUser(User.deserializeUser())        // telling passport how to deserialize user

app.use((req,res,next)=>{       // this entire res.locals variables should exist before the routers -> will crash the app as it won't recognize flash messages 
    res.locals.success = req.flash('success');   // this line needs to be before the ROUTERS before
    res.locals.error = req.flash('error');   // this line needs to be before the ROUTERS before
    res.locals.currentUser = req.user;  // req.user automatically gets filled in when user logs in, and yes 'user' is just the instance of model User created when registering
    next();
})

// ROUTERS
app.use('/', userRoutes)
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)
app.get('/', (req,res)=>{
    res.render('home')
})

// AUTHENTICATION ROUTES
app.get('/fakeUser', async (req,res)=>{
    const user = new User({email: 'aaa@gmail.com', username: 'aaa'})
    const newUser = await User.register(user, 'chicken')
    res.send(newUser)
})

// ERROR HANDLER - how/why the fuck does this shit work
app.all('*', (req,res,next) => {
    next(new expressError('page not found', 404))
})
app.use((err,req,res,next) => {
    const{statusCode = 500} = err;
    if(!err.message){
        err.message = "no error message included"
    }
    res.status(statusCode).render('error', {err})
})
app.listen(3000, ()=>{
    console.log("Connected")
})