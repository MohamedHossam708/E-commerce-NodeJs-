
import mongoose, { Types } from "mongoose";
import { subCategoryModel } from "./subCategory.model.js";

const schema = new mongoose.Schema({
    name: {
        type: String,
        unique: [true, 'name is required'],
        trim: true,
        required: true,
        minLength: [2, 'too short category name']
    },
    slug: {
        type: String,
        lowercase: true,
        required: true
    },
    image: {
        id:{type: String},
        url:{type:String}
    },
    createdBy:{
        type:Types.ObjectId,
        ref:'user'
    },
    brands:[{type:Types.ObjectId , ref:"Brand"}]
}, 
{ timestamps: true , toJSON:{virtuals:true}, toObject:{virtuals:true} })


schema.virtual("subCategory",{
    ref:"subCategory",
    localField:"_id",
    foreignField:"Category",
})


schema.post("deleteOne",{document:true,query:false},async function(){
     await subCategoryModel.deleteMany({Category:this._id})
})

export const categoryModel = mongoose.model('category', schema)



