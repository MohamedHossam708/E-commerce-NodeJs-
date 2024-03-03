import mongoose, { Types } from "mongoose";

const schema = new mongoose.Schema({
    name: {
        type: String,
        unique: [true, 'title is required'],
        trim: true,
        required: true,
        minLength: [2, 'too short product name']
    },
    slug: {
        type: String,
        lowercase: true,
        required: true
    },
    description: {
        type: String,
        trim: true,
        required: true,
        minLength: [10, 'too short product description'],
        maxlength: [500, 'too long product description']
    },
    
    images:[{
        id:{type:String, required:true},
        url:{type:String, required:true}}],
    defaultImage:{
        id:{type:String,required:true},
        url:{type:String,required:true}
        },
    price:{
        type:Number,
        min: 0 ,
        required:true
    },
    discount:{
        type:Number,
        min:0,
        max:100
    },
    quantity:{
        type:Number,
        min:1,
        default:1
    },
    sold:Number,

    rateAvg:{
        type:Number,
        max:5,
        min:0
    },
    rateCount:{
        type:Number,
        min:0,
        default:0,
    },
    rateCount:Number,
    Category:{
        type: Types.ObjectId,
        ref:'category'
        },
    subCategory:{
        type: Types.ObjectId,
        ref:'subCategory'
        },
    brand:{
        type: Types.ObjectId,
        ref:'Brand'
        },
        createdBy:{
            type:Types.ObjectId,
            ref:'user'
        },
        cloudFolder:{
            type:String,
            unique:true,
            required:true
        },
        avergeRate:{
            type:String,
            min:0,
            max:5,
        }





}, {strictQuery:true,
    timestamps: true ,
    toJSON:{virtuals:true},
    toObject:{virtuals:true} })


    schema.virtual("review",{
        ref:"review",
        localField:"_id",
        foreignField:"product"
    })

schema.virtual("finalPrice" ).get(function(){
    if(this.discount > 0) return this.price - (this.price * this.discount)/100
    return this.price
})

schema.query.paginate = function (page) {
    page = page <1 || isNaN(page) || !page ? 1:page
    const limit = 1
    const skip = limit * (page-1)
    return this.skip(skip).limit(limit)
}

schema.query.search= function(keyword){
    if(keyword){
        return this.find({name:{$regex :keyword , $options:"i"}})
    }
    return this

}




export const productModel = mongoose.model('Product', schema)



