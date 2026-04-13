import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/AsyncHandler.js"

export const verifyJWT = asyncHandler(async (req, res, next) => {
    // Look for token in headers
    const token = req.headers.authorization?.replace("Bearer ", "")

    if (!token) {
        throw new ApiError(401, "Unauthorized — no token provided")
    }

    let decoded
    try {
        // Updated to use the user's preferred ACCESS_TOKEN_CODE
        decoded = jwt.verify(token, process.env.ACCESS_TOKEN_CODE)
    } catch (err) {
        throw new ApiError(401, "Invalid or expired access token")
    }

    const user = await User.findById(decoded._id).select("-password")
    if (!user) {
        throw new ApiError(401, "User not found — token is invalid")
    }

    req.user = user
    next()
})