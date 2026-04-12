import "./config/env.js"
import { app } from "./app.js"
import db_connect from "./db/index.js"

const PORT = process.env.PORT || 8000

const startServer = async () => {
    try {
        await db_connect()

        app.on("error", (error) => {
            console.error("App error:", error)
            process.exit(1)
        })

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`)
        })
    } catch (error) {
        console.error("Failed to start server:", error)
        process.exit(1)
    }
}

startServer()
