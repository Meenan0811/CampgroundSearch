const express = require('express');
const catchAsync = require('../helpers/catchAsync');
const ExpressError = require('../helpers/ExpressError');
const Campground = require('../models/campground');
const { reviewSchema } = require('../schemas')
const Review = require('../models/review')

//Create Router object, mergeParams allows params passed through to router object
//ie... app.js file call to app.use('/campgrounds/:id/reviews', reviews) will not pass id param without
//mergeParams set to true
const reviewRoute = express.Router({ mergeParams: true });



function validateReview(req, res, next) {

    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

reviewRoute.post('/', validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', `Review Created!`);
    res.redirect(`/campgrounds/${campground._id}`);
    // res.send('Request Received');
}))

reviewRoute.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id } = req.params;
    const { reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { review: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = reviewRoute;

