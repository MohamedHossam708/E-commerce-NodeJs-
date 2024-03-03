import joi from "joi"
import { isValidObjectId } from "../../middleware/validation.middleware.js"


export const createOrderVal=joi.object({
    address:joi.string().required(),
    payment:joi.string().valid("cash","visa"),
    phone:joi.string().required(),
    cupon:joi.string()
}).required()



export const cancellOrderVal= joi.object({
    id:joi.string().custom(isValidObjectId).required()
})