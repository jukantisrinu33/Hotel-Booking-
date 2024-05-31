const Listing=require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


//Index route
module.exports.index=async(req,res,next)=>
{
    let alllistings=await Listing.find({});
    res.render("Listing/index.ejs",{alllistings}); 
};


//get form
module.exports.renderNewform=(req,res,next)=>
{
    res.render("Listing/new.ejs");
};



//details of a specific listing
module.exports.showListing=async (req,res,next)=>
{
    let id=req.params.id;
    const idData = await Listing.findOne({_id:id}).populate({path:"review",populate:{path:"author"}}).populate("owner");
    // console.log(idData.review[0].author.username);
    if(!idData || idData===undefined || idData===null)
    {
        req.flash("error","The Listing you were trying to access does not exist!");
        res.redirect("/listings");
    }
    res.render("Listing/show.ejs",{idData});     
};


//post form
module.exports.postcreateListing=async (req,res,next)=>
{
    let mapCordinates=await geocodingClient.forwardGeocode({
        query: req.body.location,
        limit: 1
      }).send();




    

    let url=req.file.path;
    let filename=req.file.filename;
    let data=req.body;
    console.log(req.body.location)
    let newData=new Listing(data); 
    newData.owner=req.user._id;
    newData.image={url,filename};
    newData.geometry=mapCordinates.body.features[0].geometry
    console.log(newData.geometry);
    await newData.save();
    req.flash("success","New listing is added!");
    res.redirect("/listings");
};



//editing data 
module.exports.editListingform=async (req,res,next)=>
{
    
    let id=req.params.id;
    const idData = await Listing.findOne({_id:id});
    console.log(idData.owner._id);
    const ownerId=res.locals.currUser._id;
    console.log(ownerId)
    if(idData===null)
    {
        req.flash("error","The Listing you were trying to access does not exist!");
        res.redirect("/listings");
    }

    let originalListingImage=idData.image.url;
    originalListingImage.replace("/upload","/upload/h_300,w_250");
    console.log(originalListingImage);
    res.render("Listing/edit.ejs",{idData,originalListingImage}); 
};

module.exports.puteditListing=async (req,res,next)=>
{

    let data=req.body;
    let id=req.params.id;
    console.log(id);
    let updatedListing=await Listing.updateOne({_id:id},{...data});
    console.log(updatedListing);
    if(typeof req.file!="undefined")
    {
        let url=req.file.path;
        let filename=req.file.filename;
        Listing.image={url,filename};
        await Listing.save();
    }

    req.flash("success","Listing is Updated!");
    res.redirect(`/listings/${id}`);

};



//deleting Listing
module.exports.deleteListing=async (req,res,next)=>
{
    let id=req.params.id;
    await Listing.findByIdAndDelete({_id:id});
    req.flash("success","Listing is Deleted!");
    res.redirect("/listings"); 


};
