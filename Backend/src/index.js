import "./config/env.js";
import { app } from "./app.js";

const PORT = process.env.CORS_ORIGIN || 8000;

const startServer = () => {
    try {
        
        app.on("error", (error) => {
            console.error("App error:", error);
            process.exit(1);
        });

        app.listen(PORT , (req , res, next ,error) => {
            console.log(`App is listening at port ${PORT}`);
        })

    } catch (error) {
        console.log("Error: " , error);
        process.exit(1)
    }
}

startServer()