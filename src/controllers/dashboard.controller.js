import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import User from "../models/users.model.js";
import { Mongoose } from "mongoose";
import Video from "../models/videos.model.js";
import User from "../models/users.model.js";


const getChannelStats = asyncHandler(async (req, res) => {

    // TODO : get the channel stats like total subscribers, total videos,
    // total likes etc
    const subscription = await User.aggregate([
        {
            $match: new Mongoose.Types.ObjectId(req.user._id)
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscriber"
            },
            $lookup: {
                from: "videos",
                localField: "_id",
                foreignField: "owner",
                as: "video",
                pipeline: [
                    {
                        $lookup: {
                            from: "likes"
                        }
                    }

                ]
            }
        },
        {
            $addFields: {
                subscriberCount: {
                    $size: "$subscriber"
                },
                videosCount: {
                    $size: "$video"
                }
            }
        },
        {
            $project: {
                subscriberCount: 1,
                videosCount: 1
            }

        }

    ])


})

const getChanelVideos = asyncHandler(async (req, res) => {

    const video = await Video.findOne({
        owner: req.user._id
    })
    return res.status(200).json(
        new ApiResponse(
            200,
            video,
            "Channel Video Fetched Sucessfully!!!"
        )
    )
})