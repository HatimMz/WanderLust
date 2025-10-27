const Joi = require('joi');

const ListingSchema = Joi.object({
  title: Joi.string().trim().required(),
  description: Joi.string().allow("").default("No description provided"),
  price: Joi.number().min(1).required(),
  location: Joi.string().trim().required(),
  country: Joi.string().trim().required()
});

const reviewSchema = Joi.object({
  comment: Joi.string().trim().required(),
  rating: Joi.number().min(1).max(5).required(),
  createdAt: Joi.date().default(() => new Date())
});

module.exports = {ListingSchema, reviewSchema};
