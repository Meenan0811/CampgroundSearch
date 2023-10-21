const express = require('express');
const catchAsync = require('../helpers/catchAsync');
const ExpressError = require('../helpers/ExpressError');
const Campground = require('../models/campground');
const { reviewSchema } = require('../schemas')
const Review = require('../models/review')
const { validateReview, isAuth, isReviewAuthor } = require('../middleware');
const review = require('../controllers/review')

//Create Router object, mergeParams allows params passed through to router object
//ie... app.js file call to app.use('/campgrounds/:id/reviews', reviews) will not pass id param without
//mergeParams set to true
const reviewRoute = express.Router({ mergeParams: true });



// function validateReview(req, res, next) {

//     const { error } = reviewSchema.validate(req.body);
//     if (error) {
//         const msg = error.details.map(el => el.message).join(',');
//         throw new ExpressError(msg, 400);
//     } else {
//         next();
//     }
// };

reviewRoute.post('/', isAuth, validateReview, catchAsync(review.pushReview))

reviewRoute.delete('/:reviewId', isReviewAuthor, isAuth, catchAsync(review.deleteReview))

module.exports = reviewRoute;

