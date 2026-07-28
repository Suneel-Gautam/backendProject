import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Like from "../models/likes.model.js";

const likeVideo = asyncHandler(async (req, res) => {
    const videoId = req.params.videoId

    const exisitingLike = await Like.findOne({
        video: videoId,
        likedBy: req.user._id
    })

    if (exisitingLike) {
        await exisitingLike.deleteOne()

        return res.status(200).json(
            new ApiResponse(
                200,
                {},
                "Unlike Sucessfully!!"
            )
        )

    }
    const like = await Like.create({
        video: videoId,
        likedBy: req.user._id
    })

    return res.status(201).json(
        new ApiResponse(
            201,
            like,
            "Video Liked Sucessfully!!"

        )
    )
})
const likeComment = asyncHandler(async (req, res) => {
    const commentId = req.params.commentId

    const exisitingLike = await Like.findOne({
        comment: commentId,
        likedBy: req.user._id
    })
    if (exisitingLike) {
        await exisitingLike.deleteOne()
        return res.status(200).json(
            new ApiResponse(
                200,
                {},
                "Unlike Sucessfully!!"
            )
        )
    }

    const like = await Like.create({
        comment: commentId,
        likedBy: req.user._id
    })

    return res.status(200).json(
        new ApiResponse(
            200,
            like,
            "Comment Liked Sucessfully!!"

        )
    )
})
const likeTweet = asyncHandler(async (req, res) => {
    const tweetId = req.params.tweetId

    const exisitingLike = await Like.findOne({
        tweet: tweetId,
        likedBy: req.user._id
    })
    if (exisitingLike) {
        await exisitingLike.deleteOne()
        return res.status(200).json(
            200,
            {},
            "Unlike Tweet Sucessfully!"
        )
    }

    const like = await Like.create({
        tweet: tweetId,
        likedBy: req.user._id
    })

    return res.status(200).json(
        new ApiResponse(
            200,
            like,
            "Tweet Liked Sucessfully!!"

        )
    )
})

export {
    likeVideo,
    likeComment,
    likeTweet
}