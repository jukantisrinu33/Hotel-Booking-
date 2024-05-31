if(process.env.NODE_ENV!="production")
{
    require("dotenv").config()
}


const express=require("express");
const router=express.Router();
const Listing=require("../models/listing.js");
const aysncWrap=require("../utils/asyncWrap.js");
const {listingSchema}=require("../schema.js");
const ExpressError=require("../utils/ExpressError.js");
const flash=require("connect-flash");
const {isAuthenticated, isOwner}=require("../utils/middleware.js");
const User=require("./user.js");
const ListingController=require("../controllers/listings.js");
const {storage}=require("../cloudConfig.js");
const multer  = require('multer');
const upload = multer({ storage });



//valdition of listings
function validatelisting(req,res,next)
{
    const {error}=listingSchema.validate(req.body);
    console.log(error);
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




//Index route
router.get("/",aysncWrap(ListingController.index));

//get form
router.get("/new",isAuthenticated,ListingController.renderNewform);
  
//details of a specific listing
router.get("/:id",aysncWrap(ListingController.showListing));




// post form
router.post("/new",isAuthenticated,upload.single('image'),validatelisting,aysncWrap(ListingController.postcreateListing));




//editing data

router.route("/:id/edit")
    .get(isAuthenticated ,aysncWrap(ListingController.editListingform))
    .put(isAuthenticated,isOwner,upload.single('image'),validatelisting, aysncWrap(ListingController.puteditListing));

router.delete("/:id/delete",isAuthenticated ,isOwner,aysncWrap(ListingController.deleteListing)); 




module.exports=router;


