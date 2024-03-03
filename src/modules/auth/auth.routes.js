import { Router } from "express";
 import {validation} from "../../middleware/validation.middleware.js"
import { SignUpSchema, activateAcountSchema, signInSchema } from "./auth.schema..js";
import { SignUp, activeAccount, signIn } from "./auth.controller.js";


const router= Router()


router.post("/SignUp",validation(SignUpSchema),SignUp)

router.get('/auth/activat_account/:token',validation(activateAcountSchema),activeAccount)

router.post('/signIn',validation(signInSchema),signIn)



export default router