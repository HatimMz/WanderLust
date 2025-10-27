const express = require("express")
const router = express.Router();
const { ListingSchema } = require("../models/joiSchema.js");
const Listing = require("../models/listings/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const customError = require("../utils/customError.js")
const { isLoggedIn, isOwner } = require("../utils/middlewares.js")


//listing validator middleware
function validateListing(req, res, next) {
    const { error } = ListingSchema.validate(req.body.listing, { convert: true, allowUnknown: true });
    if (error) {
        const msg = error.details.map(el => el.message).join(", ");
        next(new customError(400, msg));
    }

    return next();
}


// index route
router.get("/", wrapAsync(async (req, res, next) => {
    const allListings = await Listing.find({});
    // console.log(allListings);
    res.render("listings/index.ejs", { allListings });
}));


// new route
router.get("/new", isLoggedIn, wrapAsync(async (req, res, next) => {
    res.render("listings/new.ejs");
}));


// create route
router.post("/", isLoggedIn, validateListing, wrapAsync(async (req, res, next) => {

    const newLisiting = new Listing(req.body.listing);
    newLisiting.owner = req.user._id
    await newLisiting.save();
    req.flash("success", "Listing added successfully")
    res.redirect("/listings");
}));



// delete route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(async (req, res, next) => {
    const id = req.params.id;
    const deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted successfully")
    console.log(deletedListing);
    res.redirect("/listings");

}));


//edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(async (req, res, next) => {

    const id = req.params.id;
    const reqListing = await Listing.findById(id);
    if (!reqListing) {
        req.flash("error", "Listing does not exist")
        res.redirect("/listings");
    }
    else {
        res.render("listings/edit.ejs", { reqListing });
    }

}));


// PATCH route
router.put("/:id", isLoggedIn, isOwner, wrapAsync(async (req, res, next) => {

    const id = req.params.id;
    const updatedListing = req.body.listing;
    ListingSchema.validate(updatedListing);
    await Listing.findByIdAndUpdate(id, { ...updatedListing });
    res.redirect(`/listings/${id}`);

}));


// get route
router.get("/:id", wrapAsync(async (req, res, next) => {

    const id = req.params.id;
    const reqListing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    if (!reqListing) {
        req.flash("error", "Listing does not exist")
        res.redirect("/listings");
    }
    else {
        res.render("listings/get.ejs", { reqListing });
    }

}));


module.exports = router;