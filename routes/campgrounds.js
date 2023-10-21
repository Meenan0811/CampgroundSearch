const express = require('express');
const route = express.Router();
const catchAsync = require('../helpers/catchAsync');
const ExpressError = require('../helpers/ExpressError');
const Campground = require('../models/campground');
const { campgroundSchema } = require('../schemas')
const { isAuth, isAuthor, validateCampground } = require('../middleware');
const campground = require('../controllers/campgrounds');
const multer = require('multer');
const { storage } = require('../cloudinary')
const upload = multer({ storage });


route.route('/')
    .get(catchAsync(campground.index))
    .post(isAuth, upload.array('image'), validateCampground, catchAsync(campground.addNew));



//****************************************************
//-NEW 
//****************************************************
route.get('/new', isAuth, campground.newCamp)

// route.post('/', isAuth, validateCampground, catchAsync(campground.addNew))



//****************************************************
//-Edit
//****************************************************
route.get('/:id/edit', isAuth, isAuthor, catchAsync(campground.editCamp))

// route.put('/:id', isAuth, isAuthor, validateCampground, catchAsync(campground.putEditCamp))



//****************************************************
//-DELETE
//****************************************************
route.delete('/:id/delete', catchAsync(campground.deleteCamp))



route.route('/:id')
    .get(catchAsync(campground.show))
    .put(isAuth, isAuthor, upload.array('image'), validateCampground, catchAsync(campground.putEditCamp));

module.exports = route;

