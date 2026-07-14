import { Router } from "express";
import {
    register,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory
} from "../controllers/user.controller.js";
import { upload } from '../middlewares/multer.js'
import { jwtVerify } from "../middlewares/auth.middleware.js";

const router = Router()

router.route('/register').post(
    upload.fields([
        {
            name: 'avatar',
            maxCount: 1
        },
        {
            name: 'coverImage',
            maxCount: 1
        }
    ]),
    register
)
router.route('/login').post(loginUser)
router.route('/logout').post(
    jwtVerify,
    logoutUser
)
router.route('/refresh-token').post(refreshAccessToken)
router.route('/change-password').patch(
    jwtVerify,
    changeCurrentPassword
)
router.route('/getme').get(
    jwtVerify,
    getCurrentUser
)
router.route('/edit-user').patch(
    jwtVerify,
    updateAccountDetails
)
router.route('/update-avatar').patch(
    jwtVerify,
    upload.single('avatar'),
    updateUserAvatar
)
router.route('/update-coverImage').patch(
    jwtVerify,
    upload.single('coverImage'),
    updateUserCoverImage
)
router.route('/channel/:username').get(
    jwtVerify,
    getUserChannelProfile
)
router.route('/watch-history').get(
    jwtVerify,
    getWatchHistory
)

export default router