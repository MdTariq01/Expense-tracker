import { Router } from "express"
import {
    register,
    login,
    getMe,
    logout,
    refreshAccessToken,
    updateProfile,
    updatePassword,
    forgotPassword,
    resetPassword,
} from "../controllers/auth.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"

const router = Router()

router.post("/register", register)
router.post("/login", login)

// Endpoint to get a new access token using a refresh token
router.post("/refresh-token", refreshAccessToken)

// Protected routes
router.get("/me", verifyJWT, getMe)
router.post("/logout", verifyJWT, logout)
router.patch("/profile", verifyJWT, upload.single("avatar"), updateProfile)
router.patch("/password", verifyJWT, updatePassword)

router.post("/forgot-password", forgotPassword)
router.post("/reset-password/:token", resetPassword)

export default router
