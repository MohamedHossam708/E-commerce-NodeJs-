import { orderModel } from "../../../database/models/orderModel.js";
import { reviewyModel } from "../../../database/models/review.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { averageCalc } from "./review.service.js";


export const addReview=asyncHandler(async(req,res,next)=>{
    
    const {comment , rate}= req.body
    
    const order=await orderModel.find({
        user:req.user._id,
        status:"deliverd",
        "products.productId":req.params.productId
    })

    

    if(order) return next(new Error("The order need to be deliverd before you add a review",{cause:400}))


    if(await reviewyModel.findOne({createdBy:req.user._id , product:req.params.productId}))
        return next(new Error("you cant add more than one review on the same product"))

        const review=  await reviewyModel.create({
            comment,
            createdBy:req.user._id,
            productId:req.params.productId,
            rate,
            orderId:order._id
            
        })

        averageCalc(productId)


        res.json({sucess:true , message:"your review is added" })
 
})


export const updateReview=asyncHandler(async(req,res,next)=>{
   const { productId , id}= req.params
 
    const review = await reviewyModel.findOneAndUpdate({productId:req.params.productId , _id:req.params.id},{...req.body},{new:true})
   if(!review) return next(new Error("cant find the review"))

    averageCalc(productId)
   

    res.json({sucess:true , message:"review is updated" })
})