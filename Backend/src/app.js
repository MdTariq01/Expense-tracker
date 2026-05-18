import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import helmet from "helmet"

import authRoutes from "./routes/auth.routes.js"
import expenseRoutes from "./routes/expense.routes.js"
import aiRoutes from "./routes/ai.routes.js"
import incomeRoutes from "./routes/income.routes.js"
import paymentRoutes from "./routes/payment.routes.js"

const app = express()

// ─── Security & Parsing ───────────────────────────────────────────────────────
app.use(helmet())

app.use(
    cors({
        origin: (origin, callback) => {
            const allowed = process.env.CORS_ORIGIN === "*" 
                ? true 
                : process.env.CORS_ORIGIN?.split(",") || []
            
            if (process.env.NODE_ENV === "development") {
                console.log(`[CORS] Request from origin: ${origin}`);
            }

            if (allowed === true || (origin && allowed.includes(origin)) || !origin) {
                callback(null, true)
            } else {
                callback(new Error("CORS: Origin not allowed"))
            }
        },
        credentials: true,
    })
)

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes)
app.use("/api/expenses", expenseRoutes)
app.use("/api/ai", aiRoutes)
app.use("/api/income", incomeRoutes)
app.use("/api/payment", paymentRoutes)

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() })
})

// ─── Global Error Handler ─────────────────────────────────────────────────────
// Catches errors thrown via ApiError inside asyncHandler
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || "Internal Server Error"

    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    })
})

export { app }