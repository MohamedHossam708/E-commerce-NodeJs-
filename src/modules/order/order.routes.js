import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.middeleware.js";
import { isAuthorized } from "../../middleware/authoriztion.middelware.js";
import { validation } from "../../middleware/validation.middleware.js";
import {cancellOrderVal, createOrderVal } from "./oreder.validitaion.js";
import { cancelOrder, createOrder, orderWebhook } from "./order.controller.js";
import express from 'express'

const router = Router()


router.post("/", isAuthenticated , isAuthorized("user"),validation(createOrderVal),createOrder)


router.patch("/:id",isAuthenticated,isAuthorized("user"),validation(cancellOrderVal), cancelOrder)



router.post('/Webhook', express.raw({type: 'application/json'}), orderWebhook)

export default router








