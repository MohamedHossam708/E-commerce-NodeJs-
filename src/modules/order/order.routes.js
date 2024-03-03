import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.middeleware.js";
import { isAuthorized } from "../../middleware/authoriztion.middelware.js";
import { validation } from "../../middleware/validation.middleware.js";
import {cancellOrderVal, createOrderVal } from "./oreder.validitaion.js";
import { cancelOrder, createOrder } from "./order.controller.js";

const router = Router()


router.post("/", isAuthenticated , isAuthorized("user"),validation(createOrderVal),createOrder)


router.patch("/:id",isAuthenticated,isAuthorized("user"),validation(cancellOrderVal), cancelOrder)

export default router