import Joi from "joi";

export const CreateCuponSchema = Joi.object({
    discount:Joi.number().integer().min(1).max(100).required(),
    expiredAt:Joi.date().greater(Date.now()).required()
}).required()


export const updateCuponSchema = Joi.object({
    discount:Joi.number().integer().min(1).max(100),
    expiredAt:Joi.date().greater(Date.now()),
    code:Joi.string().length(3).required()

}).required()


export const deleteCuponSchema = Joi.object({
    code:Joi.string().length(3).required()
}).required()


