import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.middeleware.js";
import { isAuthorized } from "../../middleware/authoriztion.middelware.js";
import { fileUpload } from "../../utils/fileUpload.js";
import { validation } from "../../middleware/validation.middleware.js";
import { createBrandSchema, deleteBrandSchema, updateBrandSchema } from "./brand.validation.js";
import { createBrand, deleteBrand, getBrands, updateBrand } from "./brand.controller.js";

const router = Router()


router.post('/',
isAuthenticated,
isAuthorized("admin"),
fileUpload().single("brand"),
validation(createBrandSchema),
createBrand)

router.patch('/:id',
isAuthenticated,
isAuthorized("admin"),
fileUpload().single("brand"),
validation(updateBrandSchema),
updateBrand)


router.delete('/:id',
isAuthenticated,
isAuthorized("admin"),
validation(deleteBrandSchema),
deleteBrand)



router.get('/',getBrands)


export default router