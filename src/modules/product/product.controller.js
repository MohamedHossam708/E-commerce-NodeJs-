import  {nanoid}  from "nanoid";
import { brandModel } from "../../../database/models/brand.model.js";
import { categoryModel } from "../../../database/models/category.model.js";
import { subCategoryModel } from "../../../database/models/subCategory.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import cloudinary from "../../utils/cloud.js";
import { productModel } from "../../../database/models/product.model.js";
import slugify from "slugify";




export const createProduct= asyncHandler(async(req,res,next)=>{
   
    const  category = await categoryModel.findById(req.body.Category)
    if(!category) return next(new Error("This Category is not found", {cause:404}))

    const subCategory = await subCategoryModel.findById(req.body.subCategory)
    if(!subCategory) return next(new Error("This Subcategory is not found", {cause:404}))

    const brand = await brandModel.findById(req.body.brand)
    if(!brand) return next (new Error("This brand dosnt exist", {cause: 404}))

    if(!req.files) return next(new Error("product image is required", {cause:400}))

    
    const cloudFolder=req.body.name +"__"+ nanoid()
    
    let images=[]
    
    for (const file of req.files.images){
    const {secure_url , public_id }= await cloudinary.uploader.upload(file.path , {folder:`${process.env.CLOUD_FOLDER_NAME}/product/${cloudFolder}`})
     images.push({url: secure_url,id:public_id})}

     const {secure_url , public_id }= await cloudinary.uploader.upload(req.files.defaultImage[0].path , {folder:`${process.env.CLOUD_FOLDER_NAME}/product/${cloudFolder}`})

    

    const product =await  productModel.create({
        ...req.body,
        slug:slugify(req.body.name),
        cloudFolder, 
        createdBy:req.user._id,
        defaultImage:{url: secure_url , id: public_id},
        images,
    })

    return res.json({sucess: true , message:"Product created"})
})


export const deleteProduct=asyncHandler(async(req,res,next)=>{

    const product = await productModel.findById(req.params.id)
     if(!product) return next(new error("Product not found", {cause:404}))

     if(product.createdBy.toString() != req.user._id.toString())
     return next(new Error("not authorized user " ,{cause:401}))

    await product.deleteOne()

    
    const ids=product.images.map((imag)=>imag.id)
    ids.push(product.defaultImage.id)
    console.log(ids)
    await cloudinary.api.delete_resources(ids) 
    await cloudinary.api.delete_folder(`${process.env.CLOUD_FOLDER_NAME}/product/${product.cloudFolder}`)

    res.json({sucess:true , message:"Product deleted"})

})



export const getAllProducts=asyncHandler(async(req,res,next)=>{


    const {sort , page, keyword , category , brand , subcategory}=req.query
    
    if(brand && !(await brandModel.findById()))
        return next(new Error("Brand not Found"))

    if(category && !(await categoryModel.findById()))
        return next(new Error("Category not Found")) 
    
    if(subcategory && !(await subCategoryModel.findById()))
        return next(new Error("subCategory not Found"))

    const results = await productModel.find({...req.query}).sort(sort).paginate(page).search(keyword)
    res.json({sucess:true , results})
})