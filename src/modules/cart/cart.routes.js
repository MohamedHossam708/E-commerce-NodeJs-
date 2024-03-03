import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.middeleware.js";
import { isAuthorized } from "../../middleware/authoriztion.middelware.js";
import { validation } from "../../middleware/validation.middleware.js";
import { addToCartVal, deleteItemval, getCartUserVal, updateCartVal } from "./cart.validation.js";
import { addToCart, clearCart, deleteItem, updateCart, userCart } from "./cart.controller.js";

const router=Router()

router.post("/",isAuthenticated ,
 isAuthorized("user"),
  validation(addToCartVal),
  addToCart
  )

  router.get("/",isAuthenticated,
   isAuthorized("user","admin"), 
   validation(getCartUserVal),
   userCart)


   router.patch("/",isAuthenticated,
   isAuthorized("user"), 
   validation(updateCartVal),
   updateCart)


   router.patch("/:id",isAuthenticated,
   isAuthorized("user"), 
   validation(deleteItemval),
   deleteItem)

   router.put("/",isAuthenticated,
   isAuthorized("user"), 
   clearCart)

export default router