import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Tweet from "../models/tweets.model.js";


const addTweet = asyncHandler(async (req, res) => {
    const { content } = req.body

    if (!req.user._id) {
        throw new ApiError(
            403,
            "User not Found"
        )
    }
    if (!content.trim()) {
        throw new ApiError(
            400,
            "Content cant be empty "
        )
    }

    const tweet = await Tweet.create({
        owner: req.user._id,
        content
    })

    if (!tweet) {
        throw new ApiError(
            400,
            "Failed to save data"
        )
    }

    return res.status(201).json(
        new ApiResponse(
            201,
            tweet,
            "tweet Created SucessFully "
        )
    )
}
)

const editTweet = asyncHandler(async (req, res) => {
    const id = req.params.id

    const tweet = await Tweet.findByIdAndUpdate(
        id,
        {
            $set: req.body
        },
        {
            new: true
        }
    )

    if (!tweet) {
        throw new ApiError(
            404,
            "Tweet not Found"

        )
    }
    return res.status(200).json(
        new ApiResponse(
            200,
            tweet,
            "Tweet Updated Sucessfully"
        )
    )
})

const deleteTweet = asyncHandler(async (req, res) => {
    const id = req.params.id

    const tweet = await Tweet.findByIdAndDelete(
        id
    )

    if (!tweet) {
        throw new ApiError(
            404,
            "Tweet not Found"
        )
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Tweet Deleted Sucessfully"
        )
    )
}
)

const getAllTweet = asyncHandler(async (req, res) => {
    const tweet = await Tweet.find()

    return res.status(200).json(
        new ApiResponse(
            200,
            tweet,
            "Tweet Fetched Successfully"
        )
    )
})

const getMyTweet = asyncHandler(async (req, res) => {
    const ownerId = req.user._id

    if (!ownerId) {
        throw new ApiError(
            404,
            "User Id not Found"
        )
    }

    const tweet = await Tweet.find({
        owner: ownerId
    })

    return res.status(200).json(
        new ApiResponse(
            200,
            tweet,
            "My Tweet fetched Sucessfully"
        )
    )
}
)

const mytweetDetails = asyncHandler(async (req, res) => {

    const id = req.params.id

    const tweet = await Tweet.findById(
        id
    )

    if (!tweet) {
        throw new ApiError(
            404,
            "Tweet not found"
        )
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            tweet,
            "Tweet details fetched sucessfully "
        )
    )
}
)

export {
    addTweet,
    editTweet,
    deleteTweet,
    getMyTweet,
    mytweetDetails,
    getAllTweet
}