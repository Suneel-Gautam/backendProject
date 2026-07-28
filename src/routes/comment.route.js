import { Router } from "express";
import { createComment, deleteComment, editComment } from "../controllers/comment.controller.js";
import { jwtVerify } from "../middlewares/auth.middleware.js";

const router = Router()

router.route('/:videoId').post(
    jwtVerify,
    createComment
)
router.route('/:commentId').patch(
    jwtVerify,
    editComment
)
router.route('/:commentId').delete(
    jwtVerify,
    deleteComment
)


export default router