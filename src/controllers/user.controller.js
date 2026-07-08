import { asyncHandler } from "../utils/asyncHandler.js";

const register = asyncHandler(async (req, res) => {
    res.status(200).json({
        message: "sucessfully doneee"
    })
}
)

export { register }
