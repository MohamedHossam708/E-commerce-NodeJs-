import mongoose, { Types } from "mongoose";

const tokenSchema = new mongoose.Schema({
    token:{
        type:String,
        required:true
    },
    user:{
        type:Types.ObjectId,
        ref:"user"
    },
    isValied:{
        type:Boolean,
        default:true,
    }
},{timestamps:true})

export const tokenModel=mongoose.model("token",tokenSchema)