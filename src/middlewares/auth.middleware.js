import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken'
import User from "../models/users.model.js";

const jwtVerify = asyncHandler(async (req, _, next) => {

    const token = req.cookies?.accessToken || req.header('authorization')?.replace("Bearer ", "")

    if (!token) {
        throw new ApiError(403, 'Unauthorized Header')
    }
    const decodedPayload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

    const user = await User.findById(decodedPayload._id).select('-password -refreshToken')
    if (!user) {
        throw new ApiError(404, "Invalid access token ")
    }
    req.user = user
    next()

})

export { jwtVerify }