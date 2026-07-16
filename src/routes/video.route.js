import { Router } from "express";
import { addVideo, updateVideo, deleteVideo, getAllVideo, getVideoDetail, getMyVideo } from "../controllers/video.controller.js";
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
router.route('/myVideo').get(
    jwtVerify,
    getMyVideo
)
router.route('/details/:id').get(
    getVideoDetail
)


export default router