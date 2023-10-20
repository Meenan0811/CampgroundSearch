const express = require('express');
const route = express.Router();
const catchAsync = require('../helpers/catchAsync');
const ExpressError = require('../helpers/ExpressError');
const Campground = require('../models/campground');
const { campgroundSchema } = require('../schemas')
const { isAuth, isAuthor, validateCampground } = require('../middleware');
const campground = require('../controllers/campgrounds');


route.get('/', catchAsync(campground.index));



//****************************************************
//-NEW 
//****************************************************
route.get('/new', isAuth, campground.newCamp)

route.post('/', isAuth, validateCampground, catchAsync(campground.addNew))



//****************************************************
//-Edit
//****************************************************
route.get('/:id/edit', isAuth, isAuthor, catchAsync(campground.editCamp))

route.put('/:id', isAuth, isAuthor, validateCampground, catchAsync(campground.putEditCamp))



//****************************************************
//-DELETE
//****************************************************
route.delete('/:id/delete', catchAsync(campground.deleteCamp))



route.get('/:id', catchAsync(campground.show))

module.exports = route;

