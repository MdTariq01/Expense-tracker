import { Router } from "express"
import {
    addIncome,
    getIncomes,
    updateIncome,
    deleteIncome,
    getIncomeSummary,
} from "../controllers/income.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.use(verifyJWT)

router.get("/summary", getIncomeSummary)        // GET  /api/income/summary
router.post("/", addIncome)                     // POST /api/income
router.get("/", getIncomes)                     // GET  /api/income
router.patch("/:id", updateIncome)              // PATCH /api/income/:id
router.delete("/:id", deleteIncome)             // DELETE /api/income/:id

export default router
