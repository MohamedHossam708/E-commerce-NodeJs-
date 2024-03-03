import { cartModel } from "../../../database/models/Cart.model.js";
import { productModel } from "../../../database/models/product.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";


export const addToCart= asyncHandler(async(req,res,next)=>{
    const {productId , quantity }= req.body


    const product = await productModel.findById(req.body.productId)
    if(!product) return next(new Error("Product not found"))

    const isProductInCart= await cartModel.findOne({user:req.user._id , "products.productId":productId})
    if(isProductInCart){
        const theProduct= isProductInCart.products.find((pro)=>pro.productId.toString()===productId.toString())

        if(+theProduct.quantity + +quantity > +product.quantity){
        return next(new Error(`not enough quantity , only  ${product.quantity} are  avilable`))
    }else{
        theProduct.quantity =+theProduct.quantity + +quantity
        await isProductInCart.save()
        res.json({sucess:true ,  isProductInCart})
    }
    }

    if(product.quantity < req.body.quantity) return next(new Error(`not enough quatity is the stock  the avilable quantity is ${product.quantity}`))
    
    const cart = await cartModel.findOneAndUpdate({user:req.user._id},
        {$push: {products:{productId:req.body.productId , quantity:req.body.quantity }}},{new:true})
        if(!cart) return next(new Error("error in cart"))
        return res.json({sucess:true , results: cart})
})


export const userCart=asyncHandler(async(req,res,next)=>{
    
    if(req.user.role=="user"){
      const cart =  await cartModel.findOne({user:req.user._id})
      return res.json({sucess:true , results:cart})
    }
    if(req.user.role=="admin" && !req.body.cartId)return next(new Error("Cart id is required"))
    const cart =  await cartModel.findById(req.body.cartId)
    return res.json({sucess:true , results:cart})
})


export const updateCart=asyncHandler(async(req,res,next)=>{
  
    const {productId , quantity}= req.body
    const product = await productModel.findById(productId)
    if(!product) return next(new error("Product Not found"))
    if(product.quantity<quantity)return nest(new Error(`sorry, not enough quatity in stock the avilble quantity is ${quantity}`))
    const cart = await cartModel.findOneAndUpdate({user:req.user._id , "products.productId":productId},
    {"products.$.quantity":quantity},{new:true})
    if (!cart) return next(new Error("Cart not found"))
    return res.json({sucess:true , cart})
})




export const deleteItem =asyncHandler(async(req,res,next)=>{
      
    const product = await productModel.findById(req.params.id)
    if(!product) return next(new Error("Product Not found"))
     

    const cart = await cartModel.findOneAndUpdate({user:req.user._id}, {$pull:{products:{productId:req.params.id}}})

    return res.json({sucess:true , cart})
})

export const clearCart=asyncHandler(async(req,res,next)=>{
    const cart = await cartModel.findOneAndUpdate({user:req.user._id}, {products:[]},{new:true})

    return res.json({sucess:true , cart})
})