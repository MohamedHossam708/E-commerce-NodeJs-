import multer, { diskStorage } from "multer";


export const fileUpload=()=>{
   const  fileFilter=(req,file,cb)=>{
    console.log(file)
    if([!"image/png" , "image/jpeg"].includes(file.mimetype))
    return next(new Error("Invalid format"), false)

    return cb(null,true)

    }

    return multer({storage:diskStorage({}),fileFilter})
}