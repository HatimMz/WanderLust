const Listing = require("../models/listings/listing");
const Review = require("../models/reviews/reviews")


function isLoggedIn(req, res, next){
    if (!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl 
        req.flash("error2", "you Must be LoggedIn")
        return res.redirect("/users/login");
    }
    next()

}

function saveRedirectUrl(req, res, next){
    if (req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl
    }
    next()
}


async function isOwner(req, res, next){
    const id = req.params.id;
    const reqListing = await Listing.findById(id)

    if (!reqListing.owner.equals(req.user._id))
    {
        req.flash("error2", "You dont have the access")
        return res.redirect(`/listings/${id}`);
    }
    next()
}

async function isAuthor(req, res, next){
    const {id, id2} = req.params;
    const reqReview = await Review.findById(id2)

    if (!reqReview.author.equals(req.user._id))
    {
        req.flash("error2", "You dont have the access")
        return res.redirect(`/listings/${id}`);
    }
    next()
}

module.exports = {isLoggedIn, saveRedirectUrl, isOwner, isAuthor}