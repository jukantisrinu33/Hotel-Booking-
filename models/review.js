const mongoose=require("mongoose");

const reviewSchema=new mongoose.Schema({
    comment:String,
    rating:
    {
        type:Number,
        min:1,
        max:5
    },
    createAt:{
        type:Date,
        default:Date.now()
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    }
});

const review=mongoose.model("review",reviewSchema);
module.exports=review;