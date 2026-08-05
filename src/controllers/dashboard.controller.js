import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import User from "../models/users.model.js";
import { Mongoose } from "mongoose";
import Video from "../models/videos.model.js";
import User from "../models/users.model.js";


const getChannelStats = asyncHandler(async (req, res) => {


    const userStats = await User.aggregate([
        {
            $match: {
                _id: new Mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscriber"
            },
        },
        {
            $lookup: {
                from: "videos",
                localField: "_id",
                foreignField: "owner",
                as: "video",
                pipeline: [
                    {
                        $lookup: {
                            from: "likes",
                            localField: "_id",
                            foreignField: "video",
                            as: "likeCount"
                        }
                    },
                    {
                        $addFields: {
                            likeCount: {
                                $size: "$likeCount"
                            }
                        }
                    },
                    {
                        $project: {
                            likeCount: 1
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
                },
                totalLikeCount: {
                    $sum: "$likeCount.likeCount"
                }
            }
        },
        {
            $project: {
                subscriberCount: 1,
                videosCount: 1,
                totalLikeCount: 1
            }
        }
    ])

    return res.status(200).json(
        new ApiResponse(
            200,
            userStats,
            "User stats fetched sucessfully!!"
        )
    )

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

export {
    getChannelStats,
    getChanelVideos
}