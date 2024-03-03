import { cartModel } from "../../../database/models/Cart.model.js";
import { cuponModel } from "../../../database/models/cupon.model.js";
import { orderModel } from "../../../database/models/orderModel.js";
import { productModel } from "../../../database/models/product.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import cloudinary from "../../utils/cloud.js";
import createInvoice from '../../utils/pdfInvoice.js'
import path from "path";
import { sendEmail } from "../../utils/sendEmail.js";
import { fileURLToPath } from "url";
import { clearCart, updateStock } from "./order.service.js";
import { error } from "console";
import Stripe from "stripe";

const __direname=path.dirname(fileURLToPath(import.meta.url))



export const createOrder=asyncHandler(async(req,res,next)=>{

    // Check for cuppon
    let checkCupon;
    if(req.body.cupon){
       const userCupon= await cuponModel.findOne({name:req.body.cupon , expiredAt:{$gt : Date.now()} })
        checkCupon = userCupon
        if(!userCupon) return next(new Error("invalid cupon"))
    }

    //get the products from the cart
    const cart= await cartModel.findOne({user:req.user._id})
    const products = cart.products
    if( products.length < 1 )return next(new Error('empty Cart'))
    // check the validty of the products
    let orderProducts=[]
    let orderPrice=0
  
    for( let i = 0 ; i < products.length ; i++ ){
        const product = await productModel.findById(products[i].productId)
        if(!product){
        return next(new Error(`${products[i].productId}  is not found`))}
       
        if(products[i].quantity > product.quantity )
        return  next (new Error(`${product.name} out of stock , only ${product.quantity} is avilable`))
            
            orderProducts.push({
            name:product.name,
            quantity:products[i].quantity,
            itemPrice:product.price,
            totalPrice: product.price * products[i].quantity,
            productId:products[i].productId
        })
        
        orderPrice+= product.price * products[i].quantity
    }
    const order = await orderModel.create({
        user:req.user._id,
        phone: req.body.phone,
        address:req.body.address,
        payment:req.body.payment,
        products: orderProducts,
        price:orderPrice,
        cupon:{
        id:checkCupon?._id,
        name:checkCupon?.name,
        discount:checkCupon?.discount,
        
    },

    

    })
    const invoice ={
        shipping: {
          name: req.user.name,
          address: order.address,
          country: "Egypt",
        },
        items: order.products,
        subtotal: order.price,
        paid: order.finalPrice,
        invoice_nr: order._id
      };

      
     const pdfPath= path.join(__direname , `./../../invoices/${order._id}.PDF`)
    
     createInvoice(invoice ,pdfPath)
    

     const {secure_url , public_id}=await cloudinary.uploader.upload(pdfPath,{folder:`${process.env.CLOUD_FOLDER_NAME}/order/invoices`})


     order.invoice={url:secure_url , id: public_id}

     await order.save()
      
     const isSent=await sendEmail({to:req.user.email ,
         subject:"order Invoice" ,
         attachments :[{path:secure_url , contentType:"application/PDF"}]})

        if(!isSent) return next(new error("invoice wasnt send by email"))


     updateStock(order.products , true)


     clearCart(req.user.id)


     if(req.body.payment==="visa"){
        const stripe =new Stripe(process.env.StRIPE_KEY)


        let cuponExisted;
        if(order.cupon.name !== undefined){
            cuponExisted = await stripe.coupons.create({
                percent_off:order.cupon.discount,
                duration:"once"
            })
        }
        
        const session = await stripe.checkout.sessions.create({
            payment_method_types:["card"],
            mode:"payment",
            success_url:"http://localhost:5500/sucessPage.html",
            cancel_url:"http://localhost:5500/cancelPage.html",
            line_items:order.products.map((product)=>{ return{
                price_data:{
                    currency:"egp",
                    product_data:{name:product.name},
                    unit_amount:product.itemPrice *100
                },
                quantity:product.quantity
            }}),
            discounts: cuponExisted ?[{coupon:cuponExisted.id}] :[],


        })
       return res.json({sucess:true , results:session.url , order})
     }
        
    res.json({sucess:true , results:{order}})

})


export const cancelOrder=asyncHandler(async(req,res,next)=>{
    const order = await orderModel.findById(req.params.id)
    if(!order) return next(new Error("order in not found check again"))


    if(order.status == "shipped" || order.status === "deliverd" , order.status === "canceled" )
    return next(new Error("Order is already shipped or deliverd check the status again"))

    order.status="canceled"
    await order.save()

    updateStock(order.products , false)
    

    res.json({sucess:true , message:"order canceled"})
})