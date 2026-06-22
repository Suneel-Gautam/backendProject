import express from 'express'
import connectDB from "./db/index.js";
import dns from 'dns'
import { configDotenv } from "dotenv";

configDotenv();
dns.setServers(['8.8.8.8']);

const app = express();


connectDB();




// (async () => {
//     try {
//         await mongoose.connect(`${process.env.MONGO_URL}/${DATABASE_NAME}`).then(() => {
//             console.log("MonogDB Connected Sucessfully")
//         })
//         app.on('ERROR', (error) => {
//             console.log('Couldnt listen to the app', error)
//             throw error
//         })

//     } catch (error) {
//         console.log('MONOGO Connection Error', error)
//         throw error

//     }
// })()
