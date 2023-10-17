const express = require('express');
const route = express.Router();
const catchAsync = require('../helpers/catchAsync');
const ExpressError = require('../helpers/ExpressError');
const Campground = require('../models/campground');
const { campgroundSchema } = require('../schemas')
// const Review = require('../models/review')

function validateCampground(req, res, next) {

    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

// function validateReview(req, res, next) {

//     const { error } = reviewSchema.validate(req.body);
//     if (error) {
//         const msg = error.details.map(el => el.message).join(',');
//         throw new ExpressError(msg, 400);
//     } else {
//         next();
//     }
// };

route.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}))



//****************************************************
//-NEW 
//****************************************************
route.get('/new', (req, res) => {
    res.render('campgrounds/new')
})

route.post('/', validateCampground, catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('success', 'New Campground created');
    res.redirect(`/campgrounds/${campground._id}`)
}))


//****************************************************
//-NEW  REVIEW
//****************************************************

// route.post('/:id/reviews', validateReview, async (req, res) => {
//     const campground = await Campground.findById(req.params.id);
//     const review = new Review(req.body.review);
//     campground.reviews.push(review);
//     await review.save();
//     await campground.save();
//     res.redirect(`/campgrounds/${campground._id}`);
//     // res.send('Request Received');
// })



//****************************************************
//-Edit
//****************************************************
route.get('/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', { campground });
}))

route.put('/:id', validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, req.body.campground, { runValidators: true, new: true });
    const { name } = await Campground.findById(id);
    req.flash('success', `${name} Campground Succesfully edited`);
    res.redirect(`/campgrounds/${id}`);
}))



//****************************************************
//-DELETE
//****************************************************
route.delete('/:id/delete', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', `Campground Succesfully deleted`);
    res.redirect('/campgrounds');
}))



route.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate('reviews');
    if (!campground) {
        req.flash('error', 'Campground not found!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}))

module.exports = route;

// route.delete('/:id/reviews/:reviewId', async (req, res) => {
//     const { id } = req.params;
//     const { reviewId } = req.params;
//     await Campground.findByIdAndUpdate(id, { $pull: { review: reviewId } });
//     await Review.findByIdAndDelete(reviewId);
//     res.redirect(`/campgrounds/${id}`);
// })