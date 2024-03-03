import { Router } from "express"
import { isAuthenticated } from "../../middleware/authentication.middeleware.js"
import { isAuthorized } from "../../middleware/authoriztion.middelware.js"
import { validation } from "../../middleware/validation.middleware.js"
import { CreateCuponSchema, deleteCuponSchema, updateCuponSchema } from "./Cupon.validation.js"
import { createCupon, deleteCupon, getAllCupons, updateCupon } from "./Cupon.controller.js"



const router = Router()

router.post("/", isAuthenticated,
isAuthorized("admin","user"),
validation(CreateCuponSchema),
createCupon)

router.patch("/:code", isAuthenticated,
isAuthorized("admin"),
validation(updateCuponSchema),
updateCupon)



router.delete("/:code", isAuthenticated,
isAuthorized("admin"),
validation(deleteCuponSchema),
deleteCupon)

router.get("/", isAuthenticated,
isAuthorized("admin","user"),
getAllCupons)


export default router