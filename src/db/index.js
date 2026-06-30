import mongoose from "mongoose";
import { DATABASE_NAME } from "../contants.js";
import { configDotenv } from "dotenv";

configDotenv()

const connectDB = async () => {
    try {
        const connectionResultinstance = await mongoose.connect(`${process.env.MONGO_URL}/${DATABASE_NAME}`)
        console.log(`\n Mongodb Connected on ${connectionResultinstance.connection.host}  `)
    } catch (error) {
        console.error('MONGODB Connection Error', error)
        process.exit(1)
    }

}
export default connectDB