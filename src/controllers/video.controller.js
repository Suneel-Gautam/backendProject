import User from "../models/users.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { fileUpload } from "../utils/cloudinary.js";
import Video from "../models/videos.model.js";
import User from "../models/users.model.js";

const addVideo = asyncHandler(async (req, res) => {
    const { title, description, duration, isPublished } = req.body

    if (!req.user._id) {
        throw new ApiError(
            403,
            "User id is missing"
        )
    }
    if (!title?.trim()) {
        throw new ApiError(
            400,
            "title cant be empty"
        )
    }

    const videoLocalPath = req.files?.videoFile?.[0]?.path
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path

    if (!videoLocalPath) {
        throw new ApiError(
            400,
            "Video local Path is empty"
        )
    }
    if (!thumbnailLocalPath) {
        throw new ApiError(
            400,
            "thumnail local path is empty"
        )
    }

    const videoFile = await fileUpload(videoLocalPath)

    if (!videoFile) {
        throw new ApiError(
            400,
            "Video cant be uploaded to sever"
        )
    }
    const thumbnail = await fileUpload(thumbnailLocalPath)

    if (!thumbnail) {
        throw new ApiError(
            400,
            "thumbnail cant be uploaded to sever"
        )
    }

    const video = await Video.create({
        video: videoFile,
        thumbnail,
        title,
        description,
        duration,
        owner: req.user._id,
        isPublished: isPublished
    })

    if (!video) {
        throw new ApiError(
            400,
            "Failed to save data in the database"
        )
    }

    return res.status(201).json(
        new ApiResponse(
            200,
            video,
            "Video added Sucessfully"
        )
    )
})

const updateVideo = asyncHandler(async (req, res) => {

    const { title, description, duration, isPublished } = req.body
    const videoLocalPath = req.files?.videoFile?.[0]?.path
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path

    const updatedFields = {}

    if (title?.trim()) {
        updatedFields.title = title
    }
    if (description?.trim()) {
        updatedFields.description = description
    }
    if (duration) {
        updatedFields.duration = duration
    }
    if (isPublished !== undefined) {
        updatedFields.isPublished = isPublished
    }

    if (videoLocalPath) {
        const videoFile = await fileUpload(videoLocalPath)
        updatedFields.video = videoFile
    }
    if (thumbnailLocalPath) {
        const thumbnail = await fileUpload(thumbnailLocalPath)
        updatedFields.thumbnail = thumbnail
    }


    const id = req.params.id

    const video = await Video.findByIdAndUpdate(
        id,
        {
            $set: updatedFields
        },
        {
            new: true
        }
    )

    if (!video) {
        throw new ApiError(
            400,
            "Video not found"
        )
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            video,
            "Updated video sucessfully"
        )
    )
})

const deleteVideo = asyncHandler(async (req, res) => {

    const id = req.params.id

    const video = await Video.findByIdAndDelete(
        id
    )

    if (!video) {
        throw new ApiError(
            404,
            "Video Not Found"
        )
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Video Deleted SuccessFully"

        )
    )

})

const getAllVideo = asyncHandler(async (req, res) => {
    const videos = await Video.find()
    return res.status(200).json(
        new ApiResponse(
            200,
            videos,
            "All Video data fetched Successfully"
        )
    )

})

const getVideoDetail = asyncHandler(async (req, res) => {

    const id = req.params.id
    const checkVideo = await Video.findByIdAndUpdate(
        id,
        {
            $inc: {
                views: 1
            }
        },
        {
            new: true
        }
    )

    if (!checkVideo) {
        throw new ApiError(
            404,
            "Video not Found"
        )
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            checkVideo,
            "Fetched Video Details SuccessFully"
        )
    )

})





export { addVideo }