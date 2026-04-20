import crypto from "crypto"
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/AsyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { sendForgotPasswordEmail } from "../services/mail.service.js"

// ─── Constants ───────────────────────────────────────────────────────────────

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens")
    }
}

// ─── Controllers ─────────────────────────────────────────────────────────────

/**
 * POST /api/auth/register
 */
export const register = asyncHandler(async (req, res) => {
    const { name, email, password, monthlyIncome, currency } = req.body

    if (!name || !email || !password) {
        throw new ApiError(400, "Name, email and password are required")
    }

    const existing = await User.findOne({ email })
    if (existing) {
        throw new ApiError(409, "Email is already registered")
    }

    const user = await User.create({ 
        name, 
        email, 
        password,
        monthlyIncome: monthlyIncome ? Number(monthlyIncome) : 0,
        currency: currency || "USD"
    })
    
    // Generate both tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

    return res
        .status(201)
        .cookie("refreshToken", refreshToken, COOKIE_OPTIONS)
        .json(
            new ApiResponse(
                201,
                {
                    accessToken,
                    user: { 
                        id: user._id, 
                        name: user.name, 
                        email: user.email,
                        monthlyIncome: user.monthlyIncome,
                        currency: user.currency,
                        taxRate: user.taxRate,
                        membershipStatus: user.membershipStatus,
                        twoFactorEnabled: user.twoFactorEnabled,
                        avatar: user.avatar
                    },
                },
                "Account created successfully"
            )
        )
})

/**
 * POST /api/auth/login
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

    // Generate and rotate tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

    return res
        .status(200)
        .cookie("refreshToken", refreshToken, COOKIE_OPTIONS)
        .json(
            new ApiResponse(
                200,
                {
                    accessToken,
                    user: { 
                        id: user._id, 
                        name: user.name, 
                        email: user.email,
                        monthlyIncome: user.monthlyIncome,
                        currency: user.currency,
                        taxRate: user.taxRate,
                        membershipStatus: user.membershipStatus,
                        twoFactorEnabled: user.twoFactorEnabled,
                        avatar: user.avatar
                    },
                },
                "Logged in successfully"
            )
        )
})

/**
 * POST /api/auth/logout — protected
 */
export const logout = asyncHandler(async (req, res) => {
    // req.user is populated by verifyJWT middleware
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: { refreshToken: 1 }, // remove refreshToken from DB
        },
        { new: true }
    )

    return res
        .status(200)
        .clearCookie("refreshToken", COOKIE_OPTIONS)
        .json(new ApiResponse(200, null, "User logged out successfully"))
})

/**
 * POST /api/auth/refresh-token
 * Public endpoint that looks for refresh token in cookies
 */
export const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request — no refresh token")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFERESH_TOKEN_CODE
        )

        const user = await User.findById(decodedToken?._id)

        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
        }

        // Generate new pair (rotation)
        const { accessToken, refreshToken: newRefreshToken } =
            await generateAccessAndRefreshTokens(user._id)

        return res
            .status(200)
            .cookie("refreshToken", newRefreshToken, COOKIE_OPTIONS)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access token refreshed"
                )
            )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})

/**
 * GET /api/auth/me — protected
 */
export const getMe = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, req.user, "User fetched successfully"))
})

/**
 * PATCH /api/auth/profile — protected
 */
export const updateProfile = asyncHandler(async (req, res) => {
    const { name, email, monthlyIncome, currency, taxRate, twoFactorEnabled } = req.body

    const avatarLocalPath = req.file?.path
    let avatarUrl = ""
    if (avatarLocalPath) {
        const cloudinaryRes = await uploadOnCloudinary(avatarLocalPath)
        if (cloudinaryRes) {
            avatarUrl = cloudinaryRes.secure_url
        }
    }

    const user = await User.findById(req.user._id)

    if (name) user.name = name
    if (email) user.email = email
    if (monthlyIncome !== undefined) user.monthlyIncome = Number(monthlyIncome)
    if (currency) user.currency = currency
    if (taxRate !== undefined) user.taxRate = Number(taxRate)
    if (twoFactorEnabled !== undefined) user.twoFactorEnabled = !!twoFactorEnabled
    if (avatarUrl) user.avatar = avatarUrl

    await user.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Profile updated successfully"))
})

/**
 * PATCH /api/auth/password — protected
 */
export const updatePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
        throw new ApiError(400, "Both current and new passwords are required")
    }

    const user = await User.findById(req.user._id)
    const isCorrect = await user.isPasswordCorrect(currentPassword)

    if (!isCorrect) {
        throw new ApiError(401, "Invalid current password")
    }

    if (newPassword) {
        user.password = newPassword
    }

    if (req.body.twoFactorEnabled !== undefined) {
        user.twoFactorEnabled = !!req.body.twoFactorEnabled
    }

    await user.save()

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Security settings updated successfully"))
})

/**
 * POST /api/auth/forgot-password
 */
export const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body

    const user = await User.findOne({ email })
    if (!user) {
        // Return same response to prevent email enumeration
        return res.status(200).json(new ApiResponse(200, null, "If that email exists, a reset link was sent."))
    }

    // Generate token
    const rawToken = crypto.randomBytes(32).toString("hex")
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex")

    user.forgotPasswordToken = hashedToken
    user.forgotPasswordTokenExpiry = Date.now() + 15 * 60 * 1000 // 15 mins
    await user.save({ validateBeforeSave: false })

    try {
        // Use centralized mail service to send password reset email
        await sendForgotPasswordEmail(user.email, rawToken)
        console.log(`Password reset email sent successfully to ${user.email}`)

        return res.status(200).json(new ApiResponse(200, null, "If that email exists, a reset link was sent."))
    } catch (error) {
        // Revert tokens if email failed
        user.forgotPasswordToken = undefined
        user.forgotPasswordTokenExpiry = undefined
        await user.save({ validateBeforeSave: false })
        
        console.error("Error sending password reset email:", error.message)
        throw new ApiError(500, "There was an error sending the email. Please try again later.")
    }
})

/**
 * POST /api/auth/reset-password/:token
 */
export const resetPassword = asyncHandler(async (req, res) => {
    const { password } = req.body

    if (!password) {
        throw new ApiError(400, "Password is required")
    }

    const hashedToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex")

    const user = await User.findOne({
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: { $gt: Date.now() },
    })

    if (!user) {
        throw new ApiError(400, "Token is invalid or expired.")
    }

    // Set new password (pre-save hook will hash it automatically)
    user.password = password
    user.forgotPasswordToken = undefined
    user.forgotPasswordTokenExpiry = undefined
    
    await user.save()

    return res.status(200).json(new ApiResponse(200, null, "Password reset successful."))
})
