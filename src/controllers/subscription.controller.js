import { asyncHandler } from "../utils/asyncHandler.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Mongoose } from "mongoose";


// toggleSubscription
const toggleSubscription = asyncHandler(async (req, res) => {
    const id = req.params.id

    const existingSubscription = await Subscription.findOne(
        {
            subscriber: req.user._id,
            channel: id,
        }
    )

    if (existingSubscription) {
        await existingSubscription.deleteOne()
        return res.status(200).json(
            new ApiResponse(
                200,
                {},
                "Unsubscribed to channel!!"
            )
        )
    }
    const subscription = await Subscription.create({
        subscriber: req.user._id,
        channel: id,
    })
    if (!subscription) {
        throw new ApiError(
            400,
            "Failed to subscribe to the channel"
        )
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            subscription,
            "Subscribe to the Channel Sucessfully!!"

        )
    )

})

// getUserChannelSubscribers
const getUserChannelSubscribers = asyncHandler(async (req, res) => {

    const subscription = await Subscription.aggregate([
        {
            $match: {
                channel: new Mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "subscriber",
                foreignField: "_id",
                as: "subscriber"
            }
        },
        {
            $addFields: {
                $subscriber : "$subscriber"
            }
        }
       
    ])
    return res.status(200).json(
        new ApiResponse(
            200,
            { subscription },
            "User channel subscribers fetched sucessfully!!"
        )
    )
})
// getSubscribedChannels
const getSubscribedChannels = asyncHandler(async (req, res) => {

    const subscription = await Subscription.find({
        subscriber: req.user._id
    })
    return res.status(200).json(
        new ApiResponse(
            200,
            { subscription },
            "User channel subscribers fetched sucessfully!!"
        )
    )
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}
