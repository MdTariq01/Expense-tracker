import { Router } from "express"
import {
    addExpense,
    getExpenses,
    getExpenseById,
    updateExpense,
    deleteExpense,
    getExpenseSummary,
} from "../controllers/expense.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"

const router = Router()

// All expense routes require authentication
router.use(verifyJWT)

router.get("/summary", getExpenseSummary)        // GET  /api/expenses/summary
router.post("/", upload.single("receipt"), addExpense)  // POST /api/expenses
router.get("/", getExpenses)                     // GET  /api/expenses?category=&startDate=&endDate=
router.get("/:id", getExpenseById)               // GET  /api/expenses/:id
router.patch("/:id", updateExpense)              // PATCH /api/expenses/:id
router.delete("/:id", deleteExpense)             // DELETE /api/expenses/:id

export default router
