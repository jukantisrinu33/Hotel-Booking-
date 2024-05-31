const Listing=require("../models/listing.js");
//is Authenticated middelware
module.exports.isAuthenticated=function (req,res,next)
{
    if(!req.isAuthenticated())
    {
        console.log(req.originalUrl);
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must be logged in first");
        return res.redirect("/login");
    }
    next();
}

module.exports.savedredirectUrl=function (req,res,next)
{
    if(req.session.redirectUrl)
    {
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    else{
        res.locals.redirectUrl="/listings"
    }
    next();
}


module.exports.isOwner=async function (req,res,next){
    let id=req.params.id;
    let userdata= await Listing.findById(id).populate("owner");
    console.log(userdata);
    if(!res.locals.currUser._id.equals(userdata.owner._id))
    {
        req.flash("error","Cant make changes to Listing");
        return res.redirect(`/listings/${id}`)
    }
    next();
}