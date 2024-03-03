import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.middeleware.js";
import { isAuthorized } from "../../middleware/authoriztion.middelware.js";
import { fileUpload } from "../../utils/fileUpload.js";
import { validation } from "../../middleware/validation.middleware.js";
import {createProductSchema, deleteProductVal} from './product.validation.js'
import { createProduct, deleteProduct, getAllProducts } from "./product.controller.js";
import reviewRouter from '../review/review.routes.js'


const router=Router()


router.use("/:productId/Review",reviewRouter)

router.post("/",isAuthenticated,
isAuthorized("admin","user"),
fileUpload().fields([ {name:"defaultImage",maxCount:1} ,{name:"images",maxCount:3}]),
validation(createProductSchema),
createProduct)


router.delete("/:id", isAuthenticated,
isAuthorized("admin"),
validation(deleteProductVal),
deleteProduct
)


router.get("/",getAllProducts)


export default  router