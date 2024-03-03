import  jwt from "jsonwebtoken"
import { asyncHandler } from "../utils/asyncHandler.js"
import { tokenModel } from "../../database/models/tokenModel.js"
import { userModel } from "../../database/models/user.model.js"


 export const isAuthenticated = asyncHandler(async(req,res,next)=>{
// checking token existeince
    const token = req.headers.token
    
    if(!token) return next(new Error("token is required"))
// checking token vlaidation
    const tokenDb=await tokenModel.findOne({token , isValied:true })
    if (!tokenDb) return next(new Error("expired Token"))
    
// checkeing user vlaidateion
    const payload = jwt.verify(token, process.env.SECRET_KEY)
    const user = await userModel.findById(payload.id)
    if (!user) return next(new Error("user not found"))

    req.user = user 
    

    
    next()
    

})