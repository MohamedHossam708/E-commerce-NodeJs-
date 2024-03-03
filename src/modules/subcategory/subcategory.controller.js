import slugify from "slugify"
import { categoryModel } from "../../../database/models/category.model.js"
import { subCategoryModel } from "../../../database/models/subCategory.model.js"
import { asyncHandler } from "../../utils/asyncHandler.js"
import cloudinary from "../../utils/cloud.js"





export const addSubcategory =asyncHandler(async(req,res,next)=>{
    // check for category
    const category = await categoryModel.findById(req.params.categoryId)
    if(!category)next (new Error("Category is not found "))
    // check for the file
    if(!req.file) next(new Error("Subcategory Image is required" ,{cause:400}))
    const {public_id , secure_url}= await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.CLOUD_FOLDER_NAME}/Subcategory`})
    // creation of subcategory
    await subCategoryModel.create({
       name:req.body.name,
       slug:slugify(req.body.name),
       createdBy:req.user._id,
       image:{id:public_id , url:secure_url},
       Category: req.params.categoryId,
    })

       res.json({message:"Subcategory added"})
  })
 

  export const upDateSubcategory=asyncHandler(async(req,res,next)=>{
   
   
    // checking category existince
    const category = await categoryModel.findById(req.params.categoryId)
    if (!category) return next(new Error("Category is not found ", {cause: 404}))
    //checking for subcategory and the parent 
     
    const subcategory= await subCategoryModel.findOne({_id:req.params.id , Category:req.params.categoryId})
    
    if(!subcategory)return next (new Error("Subcategory dosent excist"))
    
    // checking subcategory owner (can be modified if theres more that one admin can change the categories)
    if(req.user._id.toString() !== subcategory.createdBy.toString()) return next(new Error("you are not the admin whos created this Subcategory"))
    // checking if theres update on the image of the subcategory 
    if(req.file){
       const {public_id , secure_url}= await cloudinary.uploader.upload(req.file.path, {public_id:subcategory.image.id})
       subcategory.image = {id:public_id ,url:secure_url}
    }
    // checking if theres update on subcategory name
    subcategory.name = req.body.name ? req.body.name : subcategory.name
    subcategory.slug = req.body.name ? slugify(req.body.name) : subcategory.slug
    // saving updates
    await subcategory.save()
    res.json({sucess:true ,message:"subcategory updated"})
  })


  export const deleteSubcategory= asyncHandler(async(req,res,next)=>{
    // find category 
    const category = await categoryModel.findById(req.params.categoryId)
    if(!category)next(new Error("Category not found" , {cause:404}))
    // find and subcategory and the parent category
console.log(req.param.id)
console.log(req.param.id)
    const subcategory= await subCategoryModel.findOne({_id:req.params.id ,Category:req.params.categoryId})
    if(!subcategory) next(new Error("subcategory not found"))
    // check the creater of the subcategory
    if(req.user._id.toString() !== subcategory.createdBy.toString()) return next(new Error("you are not the admin whos created this Subcategory"))


    await subCategoryModel.deleteOne()
      

    await cloudinary.uploader.destroy(subcategory.image.id)
    res.json({sucess:true ,message:"Category Deleted"})
  })


  export const AllSubcategories=asyncHandler(async(req,res,next)=>{
    // if theres category id 
    if(req.params.categoryId){
        const results = await subCategoryModel.find({Category:req.params.categoryId})
        res.json({sucess:true , results})

    }
    // if theres not  category id
    const results= await subCategoryModel.find().populate([{path:'createdBy',select:"name -_id"},
    {path:"Category",select:"name -_id"}])
    res.json({sucess:true , results})
  })