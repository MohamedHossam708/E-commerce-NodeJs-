import { cuponModel } from "../../../database/models/cupon.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import voucher_codes from 'voucher-code-generator'


export const createCupon = asyncHandler(async(req,res,next)=>{


    const code =  voucher_codes.generate({length:3})

    const cupon =await cuponModel.create({
        name:code[0],
        createdBy:req.user._id,
        discount:req.body.discount,
        expiredAt:new Date(req.body.expiredAt).getTime()

    })
    return res.json({sucess:true , message:"Cupon is created" , results:cupon})
})


export const updateCupon=asyncHandler(async(req,res,next)=>{

    const cupon =await cuponModel.findOne({name: req.params.code , expiredAt: {$gt:Date.now()}})

    if(!cupon) return next(new Error("Cupon dosent exist" ,{cause: 404}))
    console.log(cupon)
    if(req.user._id.toString() != cupon.createdBy.toString()) return next(new Error("not authorized user",{cause:403}))

    cupon.discount=req.body.discount?req.body.discount:cupon.discount
    cupon.expiredAt=req.body.expiredAt?new Date(req.body.expiredAt).getTime():cupon.expiredAt


    await cupon.save()
    return res.json({sucess:true , message:"Cupon updated"})
    
    
})


export const deleteCupon= asyncHandler(async(req,res,next)=>{
    const cupon = await cuponModel.findOne({name: req.params.code})
    if(!cupon)return next(new Error("Invalid Cupon"), {cause:404})

    if(req.user._id.toString() != cupon.createdBy.toString())
    return next(new Error("Not autorized user",{cause:403}))

    await cupon.deleteOne()

    res.json({sucess:true , message:"Cupon deleted"})
})


export const getAllCupons= asyncHandler(async(req,res,next)=>{
    if(req.user.role== "admin") {
    const cupons = await cuponModel.find()
    return res.json({sucess:true , results:{cupons}})}
    if(req.user.role== "user") {
        const cupons = await cuponModel.find({createdBy:req.user._id})
        return res.json({sucess:true , results:{cupons}})}
})