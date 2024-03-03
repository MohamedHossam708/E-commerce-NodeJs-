import Joi from "joi";
import { isValidObjectId } from "../../middleware/validation.middleware.js";

export const addReviewVal= Joi.object({
    comment:Joi.string().min(2).required(),
    productId:Joi.string().custom(isValidObjectId).required(),
    rate:Joi.number().min(1).max(5).required()
})


export const updateReviewVal= Joi.object({
    productId:Joi.string().custom(isValidObjectId),
    comment:Joi.string().min(2),
    rate:Joi.number().min(1).max(5),
    id:Joi.string().custom(isValidObjectId).required(),

})