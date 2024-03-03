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

// schema.pre("save",function(){
//     this.password=bcryptjs.hashSync(this.password,8)
//     if(this.isModified("password")){
//         this.password=bcryptjs.hashSync(this.password,8)

//     }
// })
export const userModel = mongoose.model('user', schema)



