import {
    deletePlayList,
    createPlaylist,
    getPlaylist,
    getPlaylistByid,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    updatePlaylist
} from "../controllers/playlist.controller.js";
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
router.route('/:playlistId').patch(
    jwtVerify,
    updatePlaylist
)

router.route('/:id').delete(
    jwtVerify,
    deletePlayList
)
router.route('/:userId').get(
    jwtVerify,
    getPlaylistByid
)
router.route('/add/:playlistId/:videoId').patch(
    jwtVerify,
    addVideoToPlaylist
)
router.route('/remove/:playlistId/:videoId').patch(
    jwtVerify,
    addVideoToPlaylist
)

export default router