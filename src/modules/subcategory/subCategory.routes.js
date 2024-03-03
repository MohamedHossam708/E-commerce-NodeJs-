import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.middeleware.js";
import { isAuthorized } from "../../middleware/authoriztion.middelware.js";
import { fileUpload } from "../../utils/fileUpload.js";
import { validation } from "../../middleware/validation.middleware.js";
import { addSubcategorySchema, deleteSubcategorySchema, getAllSubcategorySchema, upDateSubcategorySchema } from "./subCategory.valid.js";
import { AllSubcategories, addSubcategory, deleteSubcategory, upDateSubcategory } from "./subcategory.controller.js";

const router = Router({ mergeParams:true })

 router.post('/')

router.post('/',
isAuthenticated,isAuthorized("admin"),
fileUpload().single("Subcategory"),
validation(addSubcategorySchema),
addSubcategory)




router.patch('/:id',
isAuthenticated,isAuthorized("admin"),
fileUpload().single("Subcategory"),
validation(upDateSubcategorySchema),
upDateSubcategory)

router.delete('/:id',
isAuthenticated,isAuthorized("admin"),
validation(deleteSubcategorySchema),
deleteSubcategory)



router.get('/',validation(getAllSubcategorySchema),AllSubcategories)

export default router 