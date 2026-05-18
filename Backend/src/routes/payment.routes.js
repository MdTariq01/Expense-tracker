import { Router } from "express"
import { createOrder, verifyPayment } from "../controllers/payment.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.use(verifyJWT)

router.post("/create-order", createOrder)
router.post("/verify", verifyPayment)

export default router
