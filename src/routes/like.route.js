import { likeVideo, likeComment, likeTweet } from "../controllers/like.controller.js";
import { Router } from "express";
import { jwtVerify } from "../middlewares/auth.middleware.js";

const router = Router()

router.route('/video/:videoId').post(
    jwtVerify,
    likeVideo
)
router.route('/comment/:videoId').post(
    jwtVerify,
    likeComment
)
router.route('/tweet/:videoId').post(
    jwtVerify,
    likeTweet
)



export default router