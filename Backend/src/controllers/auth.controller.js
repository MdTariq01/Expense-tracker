import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/AsyncHandler.js"

// ─── Helper ─────────────────────────────────────────────────────────────────

const generateToken = (userId) => {
    return jwt.sign({ _id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_DURATION || "7d",
    })
}

// ─── Controllers ─────────────────────────────────────────────────────────────

/**
 * POST /api/auth/register
 * Body: { name, email, password }
 */
export const register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
        throw new ApiError(400, "Name, email and password are required")
    }

    if (password.length < 6) {
        throw new ApiError(400, "Password must be at least 6 characters")
    }

    const existing = await User.findOne({ email })
    if (existing) {
        throw new ApiError(409, "Email is already registered")
    }

    const user = await User.create({ name, email, password })
    const token = generateToken(user._id)

    return res.status(201).json(
        new ApiResponse(
            201,
            {
                token,
                user: { id: user._id, name: user.name, email: user.email },
            },
            "Account created successfully"
        )
    )
})

/**
 * POST /api/auth/login
 * Body: { email, password }
 */
export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        throw new ApiError(400, "Email and password are required")
    }

    const user = await User.findOne({ email })
    if (!user) {
        throw new ApiError(401, "Invalid email or password")
    }

    const isMatch = await user.isPasswordCorrect(password)
    if (!isMatch) {
        throw new ApiError(401, "Invalid email or password")
    }

    const token = generateToken(user._id)

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                token,
                user: { id: user._id, name: user.name, email: user.email },
            },
            "Logged in successfully"
        )
    )
})

/**
 * GET /api/auth/me  — protected
 */
export const getMe = asyncHandler(async (req, res) => {
    return res.status(200).json(
        new ApiResponse(200, req.user, "User fetched successfully")
    )
})

/**
 * POST /api/auth/logout  — protected
 * (stateless JWT — client simply discards the token)
 */
export const logout = asyncHandler(async (req, res) => {
    return res.status(200).json(
        new ApiResponse(200, null, "Logged out successfully")
    )
})
