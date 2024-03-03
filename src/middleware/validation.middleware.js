import joi from 'joi'
import { Types } from 'mongoose'




export const isValidObjectId = (vlue,helper)=>{
    if(Types.ObjectId.isValid(vlue)) return true
    return helper.message("invlaid objectId")
}


export const validation = (schema)=>{
    return(req,res,next)=>{
        const data = {...req.body , ...req.params, ...req.query}
        const validationResult=schema.validate( data,{abortEarly:false})

        if(validationResult.error){
            const errorMessage=validationResult.error.details.map((obj)=>{
                return obj.message
            })
            return next(new Error(errorMessage))
        }

        return next()

    }

}