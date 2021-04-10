const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs') 
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

const sessionConfig = {
    secret: 'thisisasecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use((flash()));

app.use(passport.initialize());
// app.use(session(sessionConfig)) must come before this
app.use(passport.session());
// Ask passport to use the local strategy. For that local strategy, which we downloaded, the authenticate method will be located in the User model called authenticate()
passport.use(new LocalStrategy(User.authenticate()));

// In session
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    // Make the key success var local, and visible for all templates when rendering
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});



// Make the public folder visible to all
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

app.get('/', (req, res) => {
    res.render('campgrounds/home');
});

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found!!!', 404));
});

app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    if (!err.message) {
        err.message = 'Error!!!'
    }
    res.status(statusCode).render('error', {err});
})

app.listen(3000, () => {
    console.log("Serving on port 3000!!!")
});