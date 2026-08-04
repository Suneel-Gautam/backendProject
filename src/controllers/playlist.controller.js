import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { fileUpload } from '../utils/cloudinary.js'
import PlayList from '../models/playlists.model.js'

const getPlaylist = asyncHandler(async (req, res) => {

    const playlist = await PlayList.findOne({
        owner: req.user._id
    })

    return res.status(200).json(
        new ApiResponse(
            200,
            { playlist },
            "Fetched playlist successfully!!"
        )
    )
})
const createPlaylist = asyncHandler(async (req, res) => {

    const { name, description } = req.body

    if (!name || !description) {
        throw new ApiError(
            400,
            "All fields are required!!"
        )
    }

    const playlist = await PlayList.create({
        name,
        description,
        owner: req.user._id
    })

    return res.status(201).json(
        new ApiResponse(
            201,
            { playlist },
            "Playlist Created Sucessfully!!!"
        )
    )

})
const deletePlayList = asyncHandler(async (req, res) => {
    const id = req.params.id

    const playlist = await PlayList.findByIdAndDelete(id)
    if (!playlist) {
        new ApiError(
            404,
            "Playlist not found!!"
        )
    }
    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Playlist deleted Sucessfully!!"
        )
    )
})
//  getPlaylistByid
const getPlaylistByid = asyncHandler(async (req, res) => {
    const userId = req.params.userId

    const playlist = await PlayList.findById(userId)

    if (!playlist) {
        throw new ApiError(
            404,
            "Playlist not found!!"
        )
    }
    return res.status(200).json(
        new ApiResponse(
            200,
            playlist,
            "Playlist fetched sucessfully!!!"
        )
    )

})
//addVideoToPlaylist
const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params

    const playlist = await PlayList.findByIdAndUpdate(
        playlistId,
        {
            $push: {
                videos: videoId
            }
        },
        {
            returnDocument: "after"
        }
    )
    if (!playlist) {
        throw new ApiError(
            404,
            "Playlist not found!!"
        )
    }
    return res.status(200).json(
        new ApiResponse(
            200,
            playlist,
            "Video Added to the playlist"
        )
    )

})
// removeVideoFromPlaylist
const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params

    const playlist = await PlayList.findByIdAndUpdate(
        playlistId,
        {
            $pull: {
                videos: videoId
            }
        },
        {
            returnDocument: "after"
        }
    )
    if (!playlist) {
        throw new ApiError(
            404,
            "Playlist not found!!"
        )
    }
    return res.status(200).json(
        new ApiResponse(
            200,
            playlist,
            "Video removed from the playlist"
        )
    )

})
// updatePlaylist
const updatePlaylist = asyncHandler(async (req, res) => {

    const { playlistId } = req.params
    const playlist = await PlayList.findByIdAndUpdate(
        playlistId,
        {
            $set: req.body
        },
    )
    if (!playlist) {
        throw new ApiError(
            404,
            "Playlist not found!!"
        )
    }
    return res.status(200).json(
        new ApiResponse(
            200,
            playlist,
            "Playlist Updated Sucessfully!!"
        )
    )


})

export {
    getPlaylist,
    createPlaylist,
    deletePlayList,
    getPlaylistByid,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    updatePlaylist
}