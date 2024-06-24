const Joi = require('joi');
const review = require('./models/review');

module.exports.listingSchema = Joi.object({
    listing : Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location : Joi.string(),
        country: Joi.string(),
        price: Joi.number().min(0),
        image: Joi.string().allow("", null),

    })
}); 

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required()
})