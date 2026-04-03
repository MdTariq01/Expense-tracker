import mongoose from "mongoose";

mongoose.set("strictQuery", true);

const db_connect = async () => {
    try {
        console.log("MONGO URI:", process.env.MONGODB_URI);
        const connectionInstance = await mongoose.connect(
            `${process.env.MONGODB_URI}`
        )
            console.log(`✅ MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("Error occured in db and here the error" , error);
        process.exit(1);
    }
}
export default db_connect;