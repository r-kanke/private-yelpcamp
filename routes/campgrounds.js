const express = require("express");
const multer = require("multer");

const catchAsync = require("../utils/catchAsync.js");
const { isLoggedIn, isAuthor, validateCampground } = require("../middlewares.js");
const campgrounds = require("../controllers/campgrounds.js");
const { cloudinary, storage } = require("../cloudinary/index.js");

const router = express.Router();
const upload = multer({ storage });


router.route("/")
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array("image"), validateCampground, catchAsync(campgrounds.createCampground));

router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router.route("/:id")
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, upload.array("image"), validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campgrounds.editCampground));

module.exports = router;