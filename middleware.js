const Campground = require("./models/campground");
const review = require("./models/review");
const { campgroundSchema } = require('./schemas');
const { reviewSchema } = require('./schemas');
const Review = require('./models/review');
const ExpressError = require('./helpers/ExpressError');


module.exports.isAuth = (req, res, next) => {
    // console.log('REQ.USER...', req.user)
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'Must be signed in to perform that function')
        return res.redirect('/login');
    }
    next();
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}


module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not  have permission');
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}

module.exports.validateCampground = (req, res, next) => {

    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

module.exports.validateReview = (req, res, next) => {

    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not  have permission');
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}


//--------------Notes about upcoming code-----------------------
// module.exports.storeReturnTo = (req, res, next) => {
//     if (req.session.returnTo) {
//         res.locals.returnTo = req.session.returnTo;
//     }
//     next();
// }

//--------------Add to isAuth function-----------------------
// module.exports.isLoggedIn = (req, res, next) => {
//     if (!req.isAuthenticated()) {
//         req.session.returnTo = req.originalUrl; // add this line
//         req.flash('error', 'You must be signed in first!');
//         return res.redirect('/login');
//     }
//     next();
// }