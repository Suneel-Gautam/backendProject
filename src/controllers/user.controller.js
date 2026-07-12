import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from '../utils/ApiError.js'
import User from '../models/users.model.js'
import { fileUpload } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from 'jsonwebtoken'

const generateAccessAndRefreshToken = async (userid) => {
    try {
        const user = await User.findById(userid)
        if (!user) {
            throw new ApiError(404, 'User not found')
        }
        const accessToken = user.createAccessToken()
        const refreshToken = user.createRefreshToken()
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })
        return { accessToken, refreshToken }

    } catch (error) {
        console.log(error)
        throw new ApiError(500, "Internal Server Error")
    }
}
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
        throw new ApiError(400, "Avatar field is required")
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
    return res.status(201).json(
        new ApiResponse(200, userCreated, "User created Sucessfully")
    )
}
)
const loginUser = asyncHandler(async (req, res) => {
    // take data from the user req.body
    const { username, email, password } = req.body
    // get username or email & validate them
    if (!(username || email)) {
        throw new ApiError(400, "please provide username or email")
    }
    if (!password) {
        throw new ApiError(400, "Please provide password ")
    }
    // find user with that data
    const user = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (!user) {
        throw new ApiError(404, "user not found ")
    }
    // check password 
    const isCorrectPassword = await user.isPasswordCorrect(password)
    if (!isCorrectPassword) {
        throw new ApiError(403, "Invalid Credentials")
    }
    // access token and refresh token generate 
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)
    // send to cookie & res
    const logInUser = await User.findById(user._id).select('-password -refreshToken')

    const options = {
        httpOnly: true,
        secure: true
    }
    return res.status(200).
        cookie("accessToken", accessToken, options).
        cookie("refreshToken", refreshToken, options).
        json(
            new ApiResponse(
                200,
                {
                    user: logInUser,
                    accessToken,
                    refreshToken
                },
                "User login SucessFully"
            )
        )
})
const logoutUser = asyncHandler(async (req, res) => {

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: null
            }
        },
        {
            new: true
        })

    if (!user) {
        throw new ApiError(404, "User not found!!")
    }
    const options = {
        httpOnly: true,
        secure: true
    }
    return res.status(201).
        clearCookie("accessToken", options).
        clearCookie('refreshToken', options).json(
            new ApiResponse(200,
                {},
                "Logout SucessFully "
            )
        )


})
const refreshAccessToken = asyncHandler(async (req, res) => {
    // get the refreshToken from the user
    const incomingToken = req.cookies?.refreshToken || req.body.refreshToken
    if (!incomingToken) {
        throw new ApiError(401, "unauthorized invalid request ")
    }
    const decoded = jwt.verify(incomingToken, process.env.REFRESH_TOKEN_SECRET)
    const user = await User.findById(decoded._id)
    if (!user) {
        throw new ApiError(401, 'Invalid refresh token')
    }

    if (!(incomingToken === user?.refreshToken)) {
        throw new ApiError(401, "refresh token is expired or used")
    }

    const { accessToken, refreshToken: NewrefreshToken } = await generateAccessAndRefreshToken(user._id)

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200).
        cookie('accessToken', accessToken, options).
        cookie('refreshToken', NewrefreshToken, options).
        json(
            new ApiResponse(200,
                {
                    accessToken,
                    refreshToken: NewrefreshToken

                },
                "AccessToken Refreshed Succesfully"
            )
        )

})
const changeCurrentPassword = asyncHandler(async (req, res) => {

    const { oldPassword, newPassword } = req.body


    const user = await User.findById(req.user._id)
    if (!oldPassword || !newPassword) {
        throw new ApiError(400, "Please provide both oldpassword and newpassword")
    }

    if (!user) {
        throw new ApiError(404, "User Not found!!")
    }

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
    if (!isPasswordCorrect) {
        throw new ApiError(401, "Old Password is incorrect, Try Again!!")
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false })

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "New password Updated Successfully"
        )
    )

})
const getCurrentUser = asyncHandler(async (req, res) => {

    res.status(200).json(
        new ApiResponse(
            200,
            req.user,
            "User Fetched SuccessFully"
        )
    )

})
const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullname, email } = req.body

    if (!fullname || !email) {
        throw new ApiError(400, "fullname and email can't be empty")
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                fullname,
                email

            }

        },
        {
            new: true
        }
    ).select('-password -refreshToken')

    if (!user) {
        throw new ApiError(404, "User not Found")
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                user
            },
            "User Data updated Sucessfully"
        )
    )
})
const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is missing!!")
    }
    const avatar = await fileUpload(avatarLocalPath)
    if (!avatar) {
        throw new ApiError(
            400,
            "Failed to upload on cloudinary"
        )
    }
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                avatar
            }
        },
        {
            new: true
        }).select('-password -refreshToken')

    if (!user) {
        throw new ApiError(
            404,
            "User not Found"
        )
    }
    return res.status(200).json(
        new ApiResponse(
            200,
            { user },
            "Avatar Updated Sucessfully!!"
        )
    )
})

export {
    register,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar
}
