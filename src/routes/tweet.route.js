import { Router } from "express";
import { addTweet, deleteTweet, editTweet, getMyTweet, mytweetDetails, getAllTweet } from "../controllers/tweet.controller.js";
import { jwtVerify } from "../middlewares/auth.middleware.js";

const router = Router()

router.route('/').post(
    jwtVerify,
    addTweet
)
router.route('/edit/:id').post(
    jwtVerify,
    editTweet
)
router.route('/delete/:id').post(
    jwtVerify,
    deleteTweet
)
router.route('/').get(
    getAllTweet
)
router.route('/details/:id').get(
    mytweetDetails
)
router.route('/mytweet').get(
    jwtVerify,
    getMyTweet
)


export default router