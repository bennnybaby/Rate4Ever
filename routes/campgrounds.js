const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
// const {campgroundSchema} = require('../schemas.js');
// const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground.js');
const {isLoggedIn, isAuthor, validateCampground} = require('../middleware');
const campgrounds = require('../controllers/campgrounds');

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground));

// Create ====> MUST BE PUT IN FRONT OF READ!!!! OR IT WILL BE OVERRIDED!!!!
router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.editCampground))
    .delete(isLoggedIn, isAuthor, isLoggedIn, catchAsync(campgrounds.deleteCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

module.exports = router;