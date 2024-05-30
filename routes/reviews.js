const express = require("express");

const catchAsync = require("../utils/catchAsync.js");
const { isLoggedIn, isReviewAuthor, validateReview } = require("../middlewares.js");
const reviews = require("../controllers/reviews.js");

const router = express.Router({ mergeParams: true});

router.post("/", isLoggedIn, validateReview, catchAsync(reviews.createReview));
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;