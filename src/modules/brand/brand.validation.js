import joi from "joi"
import { isValidObjectId } from "../../middleware/validation.middleware.js"


export const createBrandSchema = joi.object({
    name:joi.string().min(2).max(20).required(),
    categories:joi.array().items(joi.string().custom(isValidObjectId)).required(),
})


export const updateBrandSchema = joi.object({
    id:joi.string().custom(isValidObjectId).required(),
    name:joi.string().min(2).max(20),

})


export const deleteBrandSchema = joi.object({
    id:joi.string().custom(isValidObjectId).required(),
   
})