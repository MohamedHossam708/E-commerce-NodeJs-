import slugify from "slugify"
import { categoryModel } from "../../../database/models/category.model.js"
import {asyncHandler} from '../../utils/asyncHandler.js'
import cloudinary from "../../utils/cloud.js"




 export const addCategory =asyncHandler(async(req,res,next)=>{
   if(!req.file) next(new Error("category Image is required" ,{cause:400}))
   const {public_id , secure_url}= await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.CLOUD_FOLDER_NAME}/category`})
   await categoryModel.create({
      name:req.body.name,
      slug:slugify(req.body.name),
      createdBy:req.user._id,
      image:{id:public_id , url:secure_url}
   })
    res.json({message:"Category added"})
 })

 
 export const upDateCategory=asyncHandler(async(req,res,next)=>{
   
   
   // checking category existince
   const category = await categoryModel.findById(req.params.id)
   
   if (!category) return next(new Error("Category is not found ", {cause: 404}))
   
   // checking category owner (can be modified if theres more that one admin can change the categories)
   if(req.user._id.toString() !== category.createdBy.toString()) return next(new Error("you are not the admin whos created this category"))
   // checking if theres update on the image of the cateogry 
   if(req.file){
      const {public_id , secure_url}= await cloudinary.uploader.upload(req.file.path, {public_id:category.image.id})
      category.image = {id:public_id ,url:secure_url}
   }
   // checking if theres update on category name
   category.name = req.body.name ? req.body.name : category.name
   category.slug = req.body.name ? slugify(req.body.name) : category.slug
   // saving updates
   await category.save()
   res.json({sucess:true ,message:"category updated"})
 })



 export const deleteCategory= asyncHandler(async(req,res,next)=>{
   // find category 
   const category = await categoryModel.findById(req.params.id)
   if(!category)next(new Error("Category not found" , {cause:404}))
    await category.deleteOne()
   // delete image from cloudiniry
   await cloudinary.uploader.destroy(category.image.id)
   res.json({sucess:true ,message:"Category Deleted"})
 })


 export const getAllCategories = asyncHandler(async(req,res,next)=>{
   const results = await categoryModel.find().populate("subCategory")
   res.json({sucess:true , results })
 })