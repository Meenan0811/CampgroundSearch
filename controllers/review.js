const Campground = require('../models/campground');
const Review = require('../models/review');

module.exports.pushReview = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', `Review Created!`);
    res.redirect(`/campgrounds/${campground._id}`);
    // res.send('Request Received');
}

module.exports.deleteReview = async (req, res) => {
    const { id } = req.params;
    const { reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { review: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
}