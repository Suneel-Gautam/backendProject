import connectDB from "./db/index.js";
import dns from 'dns'
import { configDotenv } from "dotenv";
import { app } from "./app.js";

configDotenv();
dns.setServers(['8.8.8.8']);
const PORT = process.env.PORT



connectDB().then(() => {
    app.listen(PORT, () => {
        `Backend is running on port ${PORT}`
    })
})





