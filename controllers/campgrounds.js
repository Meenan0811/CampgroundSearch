const Campground = require('../models/campground');

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
};

module.exports.newCamp = (req, res) => {
    res.render('campgrounds/new')
}

module.exports.addNew = async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    campground.author = req.user._id;
    await campground.save();
    console.log(campground);
    req.flash('success', 'New Campground created');
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.editCamp = async (req, res) => {
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
}

module.exports.putEditCamp = async (req, res) => {
    const { id } = req.params;
    // const campground = await Campground.findById(id);
    const campground = await Campground.findByIdAndUpdate(id, req.body.campground, { runValidators: true, new: true });
    const img = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...img);
    campground.save();
    // if (campground.author.equals(req.user._id)) {
    //     const camp = await Campground.findByIdAndUpdate(id, req.body.campground, { runValidators: true, new: true });
    const name = campground.name;
    req.flash('success', `${name} Campground Succesfully edited`);
    res.redirect(`/campgrounds/${id}`);
    // } else {
    //     req.flash('error', 'You must be signed in to perform this request');
    //     res.redirect('/login')
    // }
}

module.exports.deleteCamp = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', `Campground Succesfully deleted`);
    res.redirect('/campgrounds');

}

module.exports.show = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    // console.log(campground);
    if (!campground) {
        req.flash('error', 'Campground not found!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}