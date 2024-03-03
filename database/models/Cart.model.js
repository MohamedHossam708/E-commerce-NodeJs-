import mongoose, { Types } from "mongoose";

const schema=new mongoose.Schema({
 products:[{
    productId: {type:Types.ObjectId , ref:"Product"},
    quantity:{type: Number , default:1}
 }],
 user:{type:Types.ObjectId , ref:"user" ,required:true , uniqe:true}
},{timestamps:true})






export const cartModel= mongoose.model("cart",schema) 