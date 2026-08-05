import { Router } from "express";
import {
    addVideo,
    updateVideo,
    deleteVideo,
    getAllVideo,
    getVideoDetail,
    togglePublishStatus
} from "../controllers/video.controller.js";
import { jwtVerify } from "../middlewares/auth.middleware.js";


const router = Router()

router.route('/').post(
    jwtVerify,
    addVideo
)
router.route('/edit/:id').patch(
    jwtVerify,
    updateVideo
)
router.route('/delete/:id').delete(
    jwtVerify,
    deleteVideo
)
router.route('/').get(
    getAllVideo
)

router.route('/details/:id').get(
    jwtVerify,
    getVideoDetail
)
router.route('/:id').get(
    jwtVerify,
    togglePublishStatus
)


export default router