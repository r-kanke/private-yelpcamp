const mongoose = require("mongoose");
const { Schema } = mongoose;

const Review = require("./review.js");

const imageSchema = new Schema({
    url: String,
    filename: String,
});
imageSchema.virtual("thumbnail").get(function() {
    return this.url.replace("/upload", "/upload/w_200");
});

const opts = { toJSON: { virtuals: true }};
const campgroundSchema = new Schema({
    title: String,
    images: [imageSchema, ],
    price: Number,
    description: String,
    location: String,
    geometry: {
        type: {
            type: String,
            enum: ["Point"],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
        },
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
}, opts);

campgroundSchema.virtual("properties.popupMarkup").get(function () {
    return `<b><a href="/campgrounds/${this._id}">${this.title}</a></b>
    <p>${this.description.substring(0, 32)}...</p>`;
})

campgroundSchema.post("findOneAndDelete", async function(doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
});

module.exports = mongoose.model("Campground", campgroundSchema);
