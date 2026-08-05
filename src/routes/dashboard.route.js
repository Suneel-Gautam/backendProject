import { getChannelStats, getChanelVideos } from "../controllers/dashboard.controller.js";
import { Router } from "express";
import { jwtVerify } from "../middlewares/auth.middleware.js";


const router = Router()


router.route('/stats').get(
    jwtVerify,
    getChannelStats
)
router.route('/getMyVideo').get(
    jwtVerify,
    getChanelVideos
)


export default router