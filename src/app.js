import express from 'express'
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static('public'));
app.use(cookieParser())

//router import
import userRouter from './routes/user.route.js'

app.use('/api/v1/auth', userRouter)



export { app }