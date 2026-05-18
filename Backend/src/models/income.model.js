import mongoose from "mongoose"
import { INCOME_CATEGORIES } from "../constants.js"

const incomeSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        amount: {
            type: Number,
            required: true,
            min: [0.01, "Amount must be positive"],
        },
        category: {
            type: String,
            enum: INCOME_CATEGORIES,
            default: "Other",
        },
        date: {
            type: Date,
            default: Date.now,
        },
        description: {
            type: String,
            trim: true,
        },
        isRecurring: {
            type: Boolean,
            default: false,
        },
        recurringFrequency: {
            type: String,
            enum: ["weekly", "monthly", "quarterly", "yearly", null],
            default: null,
        },
    },
    { timestamps: true }
)

export const Income = mongoose.model("Income", incomeSchema)
