import mongoose, {Schema} from "mongoose"

const expenseSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        enum: ["Food", "Transport", "Shopping", "Entertainment", "Health", "Other"],
        default: others
    },
    description: {
        type: String
    },
    receipt: {
        type: String, default: null
    }
} , {timestamps: true})

export const Expense = mongoose.model("Expense" , expenseSchema) 