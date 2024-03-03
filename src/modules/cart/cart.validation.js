import joi from 'joi'
import { isValidObjectId } from '../../middleware/validation.middleware.js'



export const addToCartVal= joi.object({
    productId:joi.string().custom(isValidObjectId).required(),
    quantity:joi.number().integer().min(1)
}).required()

export const getCartUserVal=joi.object({
 cartId:joi.string().custom(isValidObjectId)
}).required()


export const updateCartVal=joi.object({
    productId:joi.string().custom(isValidObjectId).required(),
    quantity:joi.number().integer().min(1)
})

export const deleteItemval=joi.object({
    id:joi.string().custom(isValidObjectId).required(),
})