const mongoose = require("mongoose");
const Review = require("../reviews/reviews.js");

const listingSchema = new mongoose.Schema({
    title:
    {
        type: String,
        required: true
    },

    description:
    {
        type: String
    },

    image:
    {
        filename:
        {
            type: String,
            default: "listingimage"
        },

        url:
        {
            type: String,
            default: "https://plus.unsplash.com/premium_photo-1710871398972-d7145af2ecb3?q=80&w=808&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            set: (v) => (!v || !v.trim())
                ? "https://plus.unsplash.com/premium_photo-1710871398972-d7145af2ecb3?q=80&w=808&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                : v
        },

        default: {}
    },


    price:
    {
        type: Number,
        required: true
    },

    location:
    {
        type: String,
        required: true
    },

    country:
    {
        type: String,
        required: true
    },

    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review"
    }],

    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})


listingSchema.post("findOneAndDelete", async(listing)=>{
    if (listing){
        await Review.deleteMany({_id: {$in : listing.reviews}})
    }
})


const Listing = new mongoose.model("Listing", listingSchema);
module.exports = Listing;