const express = require('express');
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// The /:id in the app.js route cannot be used in this route, unless {mergeParams: true}
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground.js');
const Review = require('../models/review');
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware');
const reviews = require('../controllers/reviews')

// Post reviews
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

// Delete a review
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;