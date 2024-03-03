import mongoose, { Types } from "mongoose";

const schema = new mongoose.Schema({
    name: {
        type: String,
        unique: [true, 'name is required'],
        trim: true,
        required: true,
        minLength: [2, 'too short subCategory name']
    },
    slug: {
        type: String,
        lowercase: true,
        required: true
    },
    Category:{
    type: Types.ObjectId,
    ref:'category',
    required:true
    },
    createdBy:{
        type:Types.ObjectId,
        ref:'user'
    },
    image:{
        id:{type:String},
        url:{type:String}},

    brands:[{type:Types.ObjectId , ref:"Brand"}]
    
}

, { timestamps: true })


export const subCategoryModel = mongoose.model('subCategory', schema)



