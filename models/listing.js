const mongoose=require("mongoose");
const review=require("./review.js");
const User=require("./user.js");
const listingSchema=new mongoose.Schema(
    {
        title:
        {
            required:true,
            type:String
        },
        description:String,
        image:
        {
            url:String,
            filename:String
            
        },
        price:
        {
            required:true,
            type:Number,
        },
        location:String,
        country:String,
        review:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"review"
        }],
        owner:
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"user"
        },

        geometry:{                          //
            type: {
                type:String,                //Copied from geomongoose page
                enum:['Point'],
                required:true
            },
            coordinates:
            {
                type:[Number],
                required:true
            }                               //
        },
    }
);


//delete listing with review middelware
const deleteListingMiddleware=listingSchema.post("findOneAndDelete",async(data)=>
{
    if(data.review.length)
    {
        await review.deleteMany({_id:{$in:data.review}});
    }
})

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;