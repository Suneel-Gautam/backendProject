import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from '../utils/ApiError.js'
import User from '../models/users.model.js'
import { fileUpload } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const register = asyncHandler(async (req, res) => {
    // get user details from frontend ( request body)
    const { username, email, fullName, password } = req.body
    // validation of the data
    if (
        [username, email, fullName, password].some(
            (item) => !item || item.trim() === ""
        )
    ) {
        throw new ApiError(400, "All fields are required");
    }
    // // check if user already exist or not?
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (existedUser) {
        throw new ApiError(409, "Username or Email already exists on database")
    }
    // check for images check for avatar 
    const avatarLocalPath = req.files?.avatar?.[0]?.path
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path || ''

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar field is required")
    }
    // upload them to cloudinary,
    const avatar = await fileUpload(avatarLocalPath)
    if (!avatar) {
        throw new ApiError(400, "Avatar field is requireds")
    }
    const coverImage = await fileUpload(coverImageLocalPath)

    // create user object and save them into db

    const user = await User.create({
        username,
        email,
        fullName,
        password,
        avatar,
        coverImage: coverImage || "",

    })
    // check for user creation 
    // remove passowrd and refresh token while returning

    const userCreated = await User.findOne({
        _id: user._id
    }).select("-password -refreshToken")
    if (!userCreated) {
        throw new ApiError(500, "Something went wrong with server")
    }
    // return response
    res.status(201).json(
        new ApiResponse(200, userCreated, "User created Sucessfully")
    )
}
)

export { register }
