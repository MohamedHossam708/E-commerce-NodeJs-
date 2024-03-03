import mongoose, { Types } from "mongoose";



const schema = new mongoose.Schema({
    user:{type:Types.ObjectId ,ref:"user" ,required:true},
    products:[{
        productId:{type:Types.ObjectId , ref:"Product"},
        quantity:{type:Number , min:1 },
        name:String,
        itemPrice:Number,
        totalPrice:Number
    }],
    address:{type:String , required:true},
    payment:{type:String , default:"cash", enum:["cash","visa"]},
    phone:{type:String , required:true},
    price:{type:Number , required:true},
    invoice:{url:String , id:String},
    cupon:{
        id:{type:Types.ObjectId , ref:"cupon"},
        name:String,
        discount:{type:Number , min:1 ,max:100}
    },
    status:{type:String , default:"placed", enum:["placed","shipped","deliverd","canceled","refunded"]}

},{timestamps: true , toJSON:{virtuals:true}, toObject:{virtuals:true} })


schema.virtual("finalPrice" ).get(function(){
    return Number.parseFloat(
     this.price - (this.price * this.cupon.discount || 0)/100).toFixed(2)
})

export const orderModel = mongoose.model('order', schema)