import Razorpay from "razorpay"
import crypto from "crypto"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/AsyncHandler.js"

const getRazorpay = () => {
    const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env
    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
        throw new ApiError(503, "Payment gateway is not configured")
    }
    return new Razorpay({ key_id: RAZORPAY_KEY_ID, key_secret: RAZORPAY_KEY_SECRET })
}

// ─── Create Order ─────────────────────────────────────────────────────────────
// POST /api/payment/create-order
// Creates a Razorpay order for the Pro plan (₹829/month)

export const createOrder = asyncHandler(async (req, res) => {
    const razorpay = getRazorpay()

    const options = {
        amount: 82900,          // ₹829 in paise (1 INR = 100 paise)
        currency: "INR",
        receipt: `receipt_${req.user._id}_${Date.now()}`,
        notes: {
            userId: req.user._id.toString(),
            plan: "Pro",
        },
    }

    const order = await razorpay.orders.create(options)

    return res.status(200).json(
        new ApiResponse(200, {
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            keyId: process.env.RAZORPAY_KEY_ID,
        }, "Order created successfully")
    )
})

// ─── Verify Payment ───────────────────────────────────────────────────────────
// POST /api/payment/verify
// Verifies HMAC signature and upgrades membership to Pro

export const verifyPayment = asyncHandler(async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        throw new ApiError(400, "Missing payment verification fields")
    }

    const { RAZORPAY_KEY_SECRET } = process.env
    if (!RAZORPAY_KEY_SECRET) {
        throw new ApiError(503, "Payment gateway is not configured")
    }

    // Verify signature: HMAC-SHA256(order_id + "|" + payment_id, key_secret)
    const body = razorpay_order_id + "|" + razorpay_payment_id
    const expectedSignature = crypto
        .createHmac("sha256", RAZORPAY_KEY_SECRET)
        .update(body)
        .digest("hex")

    if (expectedSignature !== razorpay_signature) {
        throw new ApiError(400, "Payment verification failed — invalid signature")
    }

    // Upgrade user to Pro
    const user = await User.findByIdAndUpdate(
        req.user._id,
        { membershipStatus: "Pro" },
        { new: true }
    ).select("-password -refreshToken")

    return res.status(200).json(
        new ApiResponse(200, user, "Payment verified. Welcome to Pro!")
    )
})
