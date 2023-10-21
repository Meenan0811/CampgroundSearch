if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Campground = require('./models/campground');
// const Review = require('./models/review')
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const catchAsync = require('./helpers/catchAsync');
// const joi = require('joi');
const ExpressError = require('./helpers/ExpressError');
// const { campgroundSchema, reviewSchema } = require('./schemas')
const campgroundsRouter = require('./routes/campgrounds');
const reviewsRouter = require('./routes/reviews');
const userRouter = require('./routes/user')
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');







mongoose.connect('mongodb://localhost:27017/yelp-camp');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection Error:'));
db.once('open', () => {
    console.log('Database Connected');
});

// console.log(process.env.CLOUDINARY_CLOUD_NAME, process.env.CLOUDINARY_KEY, process.env.CLOUDINARY_SECRET);

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));


//Creates Session Object with configuration settings
const sessionConfig = {
    secret: 'devSecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true, //Default Setting
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
    //TODO: - Production needs memory store set to mongoose
    //store:
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



//MiddleWare to display Flash Alerts
app.use((req, res, next) => {
    //Sets currUser value to the curruser if signed in, if not returns null
    // res.locals.returnTo = req.originalUrl;
    res.locals.currUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.get('/fake', async (req, res) => {
    const user = new User({ email: 'fake@gmai.com', username: 'fakeUser' });
    const newUser = await User.register(user, 'password');
    res.send(newUser);
})


app.use('/campgrounds', campgroundsRouter);
app.use('/campgrounds/:id/reviews', reviewsRouter);
app.use('/', userRouter);


//****************************************************
//  GET - receives request and sends response
//****************************************************
app.get('/', (req, res) => {
    res.render('home');
})


app.get('/makecampground', catchAsync(async (req, res) => {
    const camp = new Campground({ title: 'Backyard', description: 'cheap' });
    await camp.save();
    res.send(camp);
}))


//****************************************************
//-ERROR HANDLING - 
//****************************************************
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statuscode = 500, message = 'None' } = err;
    // res.status(statuscode).send(message)
    if (!err.message) err.message = 'There was a Error';
    res.render('errors', { err })
})


app.listen(3000, () => {
    console.log('Port 3000: Listening')
})




//****************************************************
//-
//****************************************************

//****************************************************
//  VALIDATION - From validation using JOI library
//****************************************************
// function validateCampground(req, res, next) {

//     const { error } = campgroundSchema.validate(req.body);
//     if (error) {
//         const msg = error.details.map(el => el.message).join(',');
//         throw new ExpressError(msg, 400);
//     } else {
//         next();
//     }
// }

// function validateReview(req, res, next) {

//     const { error } = reviewSchema.validate(req.body);
//     if (error) {
//         const msg = error.details.map(el => el.message).join(',');
//         throw new ExpressError(msg, 400);
//     } else {
//         next();
//     }
// };


// app.get('/campgrounds', catchAsync(async (req, res) => {
//     const campgrounds = await Campground.find({});
//     res.render('campgrounds/index', { campgrounds });
// }))


// //****************************************************
// //-NEW 
// //****************************************************
// app.get('/campgrounds/new', (req, res) => {
//     res.render('campgrounds/new')
// })

// app.post('/campgrounds', validateCampground, catchAsync(async (req, res, next) => {
//     const campground = new Campground(req.body.campground);
//     await campground.save();
//     res.redirect(`/campgrounds/${campground._id}`)
// }))


// //****************************************************
// //-NEW  REVIEW
// //****************************************************

// app.post('/campgrounds/:id/reviews', validateReview, async (req, res) => {
//     const campground = await Campground.findById(req.params.id);
//     const review = new Review(req.body.review);
//     campground.reviews.push(review);
//     await review.save();
//     await campground.save();
//     res.redirect(`/campgrounds/${campground._id}`);
//     // res.send('Request Received');
// })



// //****************************************************
// //-Edit
// //****************************************************
// app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
//     const { id } = req.params;
//     const campground = await Campground.findById(id);
//     res.render('campgrounds/edit', { campground });
// }))

// app.put('/campgrounds/:id', validateCampground, catchAsync(async (req, res) => {
//     const { id } = req.params;
//     const campground = await Campground.findByIdAndUpdate(id, req.body.campground, { runValidators: true, new: true });
//     res.redirect(`/campgrounds/${id}`);
// }))



// //****************************************************
// //-DELETE
// //****************************************************
// app.delete('/campgrounds/:id/delete', catchAsync(async (req, res) => {
//     const { id } = req.params;
//     await Campground.findByIdAndDelete(id);
//     res.redirect('/campgrounds');
// }))




// app.get('/campgrounds/:id', catchAsync(async (req, res) => {
//     const { id } = req.params;
//     const campground = await Campground.findById(id).populate('reviews');
//     res.render('campgrounds/show', { campground });
// }))

// app.delete('/campgrounds/:id/reviews/:reviewId', async (req, res) => {
//     const { id } = req.params;
//     const { reviewId } = req.params;
//     await Campground.findByIdAndUpdate(id, { $pull: { review: reviewId } });
//     await Review.findByIdAndDelete(reviewId);
//     res.redirect(`/campgrounds/${id}`);
// })