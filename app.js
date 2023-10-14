const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Campground = require('./models/campground');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const catchAsync = require('./helpers/catchAsync');
const ExrpessError = require('./helpers/ExpressError')
const joi = require('joi');
const ExpressError = require('./helpers/ExpressError');




mongoose.connect('mongodb://localhost:27017/yelp-camp');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection Error:'));
db.once('open', () => {
    console.log('Database Connected');
});

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


function validateCampground(req, res, next) {
    const campgroundSchema = joi.object({
        campground: joi.object({
            title: joi.string().required(),
            location: joi.string().required(),
            price: joi.number().required().min(0),
            image: joi.string().required(),
            description: joi.string().required()
        })
    })
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}
//****************************************************
//  GET - receives request and sends response
//****************************************************
app.get('/', (req, res) => {
    res.render('home');
})

app.get('/campgrounds', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}))

app.get('/makecampground', catchAsync(async (req, res) => {
    const camp = new Campground({ title: 'Backyard', description: 'cheap' });
    await camp.save();
    res.send(camp);
}))

//****************************************************
//-NEW 
//****************************************************
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new')
})

app.post('/campgrounds', validateCampground, catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
}))

//-----------------------------------------------------

//****************************************************
//-Edit
//****************************************************
app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', { campground });
}))

app.put('/campgrounds/:id', validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, req.body.campground, { runValidators: true, new: true });
    res.redirect(`/campgrounds/${id}`);
}))


//****************************************************
//-DELETE
//****************************************************
app.delete('/campgrounds/:id/delete', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))




app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/show', { campground });
}))


//****************************************************
//-ERROR HANDLING - 
//****************************************************
app.all('*', (req, res, next) => {
    next(new ExrpessError('Page Not Found', 404))
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