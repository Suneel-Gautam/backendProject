import { Router } from "express";
import { register, loginUser, logoutUser } from "../controllers/user.controller.js";
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

export default router