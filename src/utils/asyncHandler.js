// const asyncHandler = (fnc) => async (req, res, next) => {
//     try {
//         await fnc(req, res, next)
//     } catch (error) {
//         res.status(error.status || 500)
//             .json({
//                 message: error.message
//                 , success: false
//             })
//     }
// }

const asyncHandler = (requestHandler) =>
    (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
    }

export { asyncHandler }
