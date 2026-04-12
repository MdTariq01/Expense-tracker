import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import helmet from "helmet"

import authRoutes from "./routes/auth.routes.js"
import expenseRoutes from "./routes/expense.routes.js"
import aiRoutes from "./routes/ai.routes.js"

const app = express()

// ─── Security & Parsing ───────────────────────────────────────────────────────
app.use(helmet())

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
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