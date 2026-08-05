import Comment from "../models/commments.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createComment = asyncHandler(async (req, res) => {
    const { content } = req.body
    const videoId = req.params.videoId

    const commentExist = await Comment.findOne({
        video: videoId,
        owner: req.user._id
    })

    if (commentExist) {
        throw new ApiError(
            400,
            "User Already posted Comment for this video!!"
        )
    }

    if (!content.trim()) {
        throw new ApiError(
            400,
            "Content can't be empty"
        )
    }

    const comment = await Comment.create({
        content,
        video: videoId,
        owner: req.user._id
    })

    return res.status(201).json(
        new ApiResponse(
            201,
            comment,
            "Created Comment Sucessfully!!"

        )
    )
})
const editComment = asyncHandler(async (req, res) => {
    const commentId = req.params.commentId

    const comment = await Comment.findByIdAndUpdate(
        commentId,
        {
            $set: req.body
        }, {
        returnDocument: "after"
    })

    if (!comment) {
        throw new ApiError(
            404,
            "Comment not found!!"
        )
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            comment,
            "Comment Edited Sucessfully!!!"
        )
    )




})
const deleteComment = asyncHandler(async (req, res) => {
    const commentId = req.params.commentId

    const comment = await Comment.findByIdAndDelete(commentId)

    if (!comment) {
        throw new ApiError(
            404,
            "Comment not found!!!"
        )
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Comment Deleted Sucessfully!!"
        )
    )


})

export {
    createComment,
    editComment,
    deleteComment
}