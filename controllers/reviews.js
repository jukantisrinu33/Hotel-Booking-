const Listing=require("../models/listing.js");
const review=require("../models/review.js");

//add review
module.exports.postaddReview=async(req,res,next)=>
{
    let id=req.params.id;
    const idData=await Listing.findById(id);
    const newReview=new review(req.body)
    newReview.author=res.locals.currUser._id;
    console.log(newReview);
    idData.review.push(newReview);
    await newReview.save();
    await idData.save();
    req.flash("success","Your Review is added!");
    res.redirect(`/listings/${id}`);
};



//delete Review
module.exports.deleteReview=async(req,res,next)=>
{
    const {id,reviewid}=req.params;
    console.log(id,reviewid);
    let reviewData=await review.findById(reviewid);
    console.log(reviewData.author._id,res.locals.currUser._id)
    if(res.locals.currUser._id.equals(reviewData.author._id))
    {
        await review.findByIdAndDelete(reviewid);
        await Listing.findByIdAndUpdate(id,{$pull:{review:reviewid}});
        req.flash("success","Your review is deleted!");
        res.redirect(`/listings/${id}`);
    }
    else
    {
        req.flash("error","review can't be deleted");
        res.redirect(`/listings/${id}`);
    }

};