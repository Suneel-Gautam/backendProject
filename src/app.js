import express from 'express'
import cookieParser from 'cookie-parser';
import videoRouter from './routes/video.route.js';
import tweetRouter from './routes/tweet.route.js'
import likeRouter from './routes/like.route.js'
import playlistRouter from './routes/playlist.route.js'
import subscriptionRouter from './routes/subscription.route.js'
import dashboardRouter from './routes/dashboard.route.js'

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static('public'));
app.use(cookieParser())

//router import
import userRouter from './routes/user.route.js'

app.use('/api/v1/auth', userRouter)
app.use('/api/v1/video', videoRouter)
app.use('/api/v1/tweet', tweetRouter)
app.use('/api/v1/like', likeRouter)
app.user('/api/v1/playlist', playlistRouter)
app.user('/api/v1/subscription', subscriptionRouter)
app.user('/api/v1/dashboard', dashboardRouter)



export { app }