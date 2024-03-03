import joi from "joi"

export const SignUpSchema=joi.object({
    name:joi.string().min(2).max(20).required(),
    email:joi.string().email().required(),
    password:joi.string().required(),
}).required()


export const activateAcountSchema = joi.object({
    token :joi.string().required()
}).required()


export const signInSchema = joi.object({
    email:joi.string().email().required(),
    password:joi.string().required()
})