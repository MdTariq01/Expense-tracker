import mongoose from "mongoose"
import { EXPENSE_CATEGORIES } from "../constants.js"

const expenseSchema = new mongoose.Schema(
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
            min: [0, "Amount cannot be negative"],
        },
        category: {
            type: String,
            enum: EXPENSE_CATEGORIES,
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
        receiptUrl: {
            type: String,
            default: null,
        },
    },
    { timestamps: true }
)

export const Expense = mongoose.model("Expense", expenseSchema)