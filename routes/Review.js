const express=require("express");
const router=express.Router({mergeParams:true});
const Listing=require("../models/listing.js");
const aysncWrap=require("../utils/asyncWrap.js");
const {reviewSchema}=require("../schema.js");
const review=require("../models/review.js");
const ExpressError=require("../utils/ExpressError.js");
const { isAuthenticated } = require("../utils/middleware.js");
const ReviewController=require("../controllers/reviews.js");


//validation of reviews
function validatereview(req,res,next)
{
    const {error}=reviewSchema.validate(req.body);
    if(error)
    {
        next(new ExpressError(400,error));
        return;
    }
    else
    {
        next();
    }
}


//add review
router.post("/",validatereview,isAuthenticated,aysncWrap(ReviewController.postaddReview));

//delete review
router.delete("/:reviewid",isAuthenticated,aysncWrap(ReviewController.deleteReview));


module.exports=router;