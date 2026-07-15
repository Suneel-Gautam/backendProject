import { Router } from "express";
import { addVideo, updateVideo, deleteVideo, getAllVideo, getVideoDetail } from "../controllers/video.controller.js";
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
    getVideoDetail
)


export default router