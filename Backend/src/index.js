import "./config/env.js";   
import { app } from "./app.js";
import db_connect from "./db/index.js";

const PORT = process.env.PORT || 8000;

const startServer = async () => {
    try {
        await db_connect();

        app.on("error", (error) => {
            console.error("App error:", error);
            process.exit(1);
        });

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error("MongoDB connection failed!!!", error);
        process.exit(1);
    }
};

startServer();



















// import { MongoClient } from "mongodb";

// const url = process.env.MONGODB_URI;

// const client = new MongoClient(url);

// const dbName = "Tariq";

// async function db_connect() {
//     try {
//         await client.connect();
//         console.log('connected successfully');
        
//     } catch (error) {
//         console.log(error);
        
//     }
// }

// db_connect();
























// import express from 'express';
// import dotenv from 'dotenv';
// import db_connect from './db/index.js';

// dotenv.config({ path: './.env' });

// const app = express();
// const PORT = process.env.PORT || 3000;

// app.use(express.json());

// const startServer = async () => {
//     try {
//         await db_connect();
//         app.listen(PORT, () => {
//             console.log(`Server is running on port ${PORT}`);
//         });
//     } catch (error) {
//         console.error('Failed to start server:', error);
//         process.exit(1);
//     }
// };

// startServer();


