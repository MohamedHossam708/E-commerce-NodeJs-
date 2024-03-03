import mongoose, { Types } from "mongoose";

const schema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
       
    },
    expiredAt: {
        type: Date,
    },
    discount:{
        type:Number,
        required:true,
    },
    createdBy:{
        type:Types.ObjectId,
        ref:'user'
    }
}, { timestamps: true })


export const cuponModel = mongoose.model('cupon', schema)



