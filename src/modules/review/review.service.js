import { productModel } from "../../../database/models/product.model.js"
import { reviewyModel } from "../../../database/models/review.model.js"


export const averageCalc=async(productId)=>{
    let calcRate=0
    const product= await productModel.findById(productId)
    const reviews= await reviewyModel.find({productId})
    
    for(let i=0 ; i <reviews.length ; i++){
        calcRate+= reviews[i].rate
       
    }
    product.avergeRate=(calcRate / reviews.length).toFixed(1)


    await product.save()
   
}