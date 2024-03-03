import joi from 'joi'
import { isValidObjectId } from '../../middleware/validation.middleware.js'


export const addSubcategorySchema = joi.object({
    name:joi.string().min(2).max(20).required(),
    categoryId:joi.string().custom(isValidObjectId).required()
}).required()

export const upDateSubcategorySchema = joi.object({
    name:joi.string().min(2).max(20),
    id:joi.string().custom(isValidObjectId).required(), //sub category id
    categoryId:joi.string().custom(isValidObjectId).required() //category id

}).required()



export const deleteSubcategorySchema = joi.object({
    categoryId:joi.string().custom(isValidObjectId).required() ,//category id
    id:joi.string().custom(isValidObjectId).required() // subcategory id
}).required()

export const getAllSubcategorySchema = joi.object({
    categoryId:joi.string().custom(isValidObjectId) ,//category id
    
}).required()