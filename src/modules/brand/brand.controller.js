import { categoryModel } from "../../../database/models/category.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import cloudinary from "../../utils/cloud.js";
import {brandModel} from '../../../database/models/brand.model.js'
import slugify from "slugify";



export const createBrand=asyncHandler(async(req,res,next)=>{
    // check categories 
    const {categories , name} = req.body
    categories.forEach(async(categoryId)=>{
        const isExist=await categoryModel.findById(categoryId)
        if(!isExist)next(new Error(`Category ${categoryId} is not found`, {cause:404}))
    
    })
    if(!req.file) return next (new Error('Brand image is required' , {cause : 400}))

    const {secure_url , public_id} = await cloudinary.uploader.upload(req.file.path , {folder:`${process.env.CLOUD_FOLDER_NAME}/Brands`})

    const brand = await brandModel.create({
        name,
        createdBy:req.user._id,
        slug:slugify(name),
        logo:{url:secure_url , id:public_id}
    })
    console.log(brandModel)
    categories.forEach(async(categoryId)=>{
        const category = await categoryModel.findByIdAndUpdate(categoryId , {
            $push:{brands: brand._id}})
    })

    return res.json("Brand Added")
})


export const updateBrand = asyncHandler(async(req,res,next)=>{
    // check for brand 
    const Brand =  await brandModel.findById(req.params.id)
    if(!Brand) return next(new Error("brand dosent exist",{cause:404}))
    //chec if there is file
    if(req.file){
    const {secure_url,public_id}= await cloudinary.uploader.upload(Brand.logo.id)
    Brand.logo={url: secure_url , id:public_id}
}
    Brand.name=req.body.name?req.body.name : Brand.name
    Brand.slug=req.body.name?slugify(req.body.name) : Brand.slug


   await Brand.save()
   

   return res.json({succes: true , message:"Brand updated"})

})


export const deleteBrand = (asyncHandler(async(req,res,next)=>{
//Deleteing brand
    const brand = await brandModel.findByIdAndDelete(req.params.id)
    if(!brand) return next(new Error("Brand id not found", {cause:404}))

    //delete the image from cloudinary
    await cloudinary.uploader.destroy(brand.logo.id)
    // find the category that cotains this brand id
    await categoryModel.updateMany({},{$pull:{brands:brand._id}})

    res.json({sucess:true , message:"Brand id deleted"})

}))


export const getBrands = asyncHandler(async(req,res,next)=>{
    let brand=await brandModel.find()
     res.json({sucess:true , brand})

})