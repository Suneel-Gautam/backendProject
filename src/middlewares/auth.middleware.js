import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from 'jsonwebtoken'
import User from "../models/users.model";

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