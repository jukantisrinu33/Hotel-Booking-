const joi=require("joi");

module.exports.listingSchema=joi.object({
        title:joi.string().required(),
        description:joi.string().required(),
        location:joi.string().required(),
        country:joi.string().required(),
        price:joi.number().min(0).required(),
        image:joi.string().allow("",null)
});

module.exports.reviewSchema=joi.object({
        rating:joi.number().min(1).max(5).required(),
        comment:joi.string().required()
});