const express = require('express');
const route = express.Router();
const catchAsync = require('../helpers/catchAsync');
const ExpressError = require('../helpers/ExpressError');
const Campground = require('../models/campground');
const { campgroundSchema } = require('../schemas')
const { isAuth, isAuthor } = require('../middleware');

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
route.get('/new', isAuth, (req, res) => {

    res.render('campgrounds/new')
})

route.post('/', isAuth, validateCampground, catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    console.log('campground');
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
route.get('/:id/edit', isAuth, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    // if (campground.author.equals(req.user._id)) {
    //     res.render('campgrounds/edit', { campground });
    // } else {
    //     console.log('else enetered')
    //     req.flash('error', 'You do not have permission ')
    //     res.redirect(`/campgrounds/${id}`)
    // }
    res.render('campgrounds/edit', { campground });
}))

route.put('/:id', isAuth, isAuthor, validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (campground.author.equals(req.user._id)) {
        const camp = await Campground.findByIdAndUpdate(id, req.body.campground, { runValidators: true, new: true });
        const { name } = await Campground.findById(id);
        req.flash('success', `${name} Campground Succesfully edited`);
        res.redirect(`/campgrounds/${id}`);
    } else {
        req.flash('error', 'You must be signed in to perform this request');
        res.redirect('/login')
    }
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
    const campground = await Campground.findById(id).populate('reviews').populate('author');
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