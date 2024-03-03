import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.middeleware.js";
import { isAuthorized } from "../../middleware/authoriztion.middelware.js";
import { validation } from "../../middleware/validation.middleware.js";
import { addReviewVal, updateReviewVal } from "./review.validiation.js";
import { addReview, updateReview } from "./review.controler.js";



const router = Router({mergeParams:true})

router.post("/",isAuthenticated,isAuthorized("user"), validation(addReviewVal),addReview)


router.patch("/:id",isAuthenticated,isAuthorized("user"), validation(updateReviewVal),updateReview)

export default router 