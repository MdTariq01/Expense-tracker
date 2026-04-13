import mongoose from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
        },
        refreshToken: {
            type: String,
        },
        monthlyIncome: {
            type: Number,
            default: 0,
        },
        currency: {
            type: String,
            default: "USD",
        },
        taxRate: {
            type: Number,
            default: 0,
        },
        twoFactorEnabled: {
            type: Boolean,
            default: false,
        },
        membershipStatus: {
            type: String,
            default: "Standard",
        },
        avatar: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
)

// Hash password before saving
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return
    this.password = await bcrypt.hash(this.password, 10)
})

// Compare plain-text password with hashed one
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

// Generate Access Token (Short-lived)
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            name: this.name,
        },
        process.env.ACCESS_TOKEN_CODE,
        {
            expiresIn: process.env.ACCESS_TOKEN_DURATION,
        }
    )
}

// Generate Refresh Token (Long-lived)
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFERESH_TOKEN_CODE,
        {
            expiresIn: process.env.REFERESH_TOKEN_DURATION,
        }
    )
}

export const User = mongoose.model("User", userSchema)