import { Router } from "express"
import { getSpendInsights, parseExpenseFromText } from "../controllers/ai.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

// All AI routes require authentication
router.use(verifyJWT)

router.get("/insights", getSpendInsights)         // GET  /api/ai/insights
router.post("/parse-expense", parseExpenseFromText) // POST /api/ai/parse-expense

export default router
