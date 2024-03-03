import mongoose from "mongoose";
import bcryptjs from "bcrypt"

const schema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique:true,
    },
    password: {
        type: String,
        required: true,

    },
    isConfirmed:{
        type:Boolean,
        default:false
    },
    isActive:{
        type:Boolean,
        default:true
    },
    isBlocked:{
        type:Boolean,
        default:false
    },
    confirmEmail:{
        type:Boolean,
        default:false
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    }
    
}, { timestamps: true })


export const userModel = mongoose.model('user', schema)



