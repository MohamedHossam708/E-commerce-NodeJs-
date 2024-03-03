import mongoose, { Types } from "mongoose";

const schema = new mongoose.Schema({
    name: {
        type: String,
        unique: [true, 'name is required'],
        trim: true,
        required: true,
        minLength: [2, 'too short Brand name']
    },
    slug: {
        type: String,
        lowercase: true,
        required: true
    },
    logo:{
        url:{type:String , required:true},
        id:{type:String , required:true}
    },
    createdBy:{
        type:Types.ObjectId,
        ref:'user'
    }
}, { timestamps: true })


export const brandModel = mongoose.model('Brand', schema)



