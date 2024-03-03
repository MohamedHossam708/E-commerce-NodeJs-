import joi from 'joi'
import { isValidObjectId } from '../../middleware/validation.middleware.js'


export const addCategorySchema = joi.object({
    name:joi.string().min(2).max(20).required(),
}).required()



export const upDateCategorySchema = joi.object({
    name:joi.string().min(2).max(20),
    id:joi.string().custom(isValidObjectId).required()
}).required()


export const deleteCategorySchema = joi.object({
    id:joi.string().custom(isValidObjectId).required()
}).required()