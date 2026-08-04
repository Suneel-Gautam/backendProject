import { toggleSubscription, getSubscribedChannels, getUserChannelSubscribers } from "../controllers/subscription.controller.js";
import { Router } from "express";
import { jwtVerify } from "../middlewares/auth.middleware.js";

const router = Router()


router.route('/subscribe/:id').get(
    jwtVerify,
    toggleSubscription
)

router.route('/userChannelSubscribers').get(
    jwtVerify,
    getUserChannelSubscribers
)

router.route('/subscribedChannels').get(
    jwtVerify,
    getSubscribedChannels
)

export default router 