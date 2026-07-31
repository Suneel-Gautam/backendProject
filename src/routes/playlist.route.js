import { deletePlayList, createPlaylist, getPlaylist } from "../controllers/playlist.controller.js";
import { Router } from "express";
import { jwtVerify } from "../middlewares/auth.middleware.js";

const router = Router()

router.route('/').get(
    jwtVerify,
    getPlaylist
)
router.route('/').post(
    jwtVerify,
    createPlaylist
)
router.route('/:id').delete(
    jwtVerify,
    deletePlayList
)

export default router