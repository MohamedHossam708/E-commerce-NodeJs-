import { Router } from "express";
import { addCategory, deleteCategory, getAllCategories, upDateCategory } from "./category.controller.js";
import {isAuthenticated} from "../../middleware/authentication.middeleware.js"
import { isAuthorized } from "../../middleware/authoriztion.middelware.js";
import { fileUpload } from "../../utils/fileUpload.js";
import { validation } from "../../middleware/validation.middleware.js";
import { addCategorySchema, deleteCategorySchema, upDateCategorySchema } from "./category.validation.js";
import Subcategory from '../subcategory/subCategory.routes.js'
const router = Router()


router.use("/:categoryId/Subcategory",Subcategory)

router.post('/',
isAuthenticated,isAuthorized("admin"),
fileUpload().single("category"),
validation(addCategorySchema),
addCategory)


router.patch('/:id',
isAuthenticated,isAuthorized("admin"),
fileUpload().single("category"),
validation(upDateCategorySchema),
upDateCategory)



router.delete('/:id',
isAuthenticated,isAuthorized("admin"),
validation(deleteCategorySchema),
deleteCategory)


router.get('/',getAllCategories)

export default router