import { Expense } from "../models/expense.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/AsyncHandler.js"

// ─── Add Expense ─────────────────────────────────────────────────────────────

/**
 * POST /api/expenses
 * Body: { title, amount, category, date, description }
 * File:  receipt (optional image via multipart/form-data)
 */
export const addExpense = asyncHandler(async (req, res) => {
    const { title, amount, category, date, description } = req.body

    if (!title || !amount) {
        throw new ApiError(400, "Title and amount are required")
    }

    if (isNaN(amount) || Number(amount) <= 0) {
        throw new ApiError(400, "Amount must be a positive number")
    }

    let receiptUrl = null
    if (req.file) {
        const uploaded = await uploadOnCloudinary(req.file.path)
        if (uploaded) receiptUrl = uploaded.secure_url
    }

    const expense = await Expense.create({
        user: req.user._id,
        title,
        amount: Number(amount),
        category,
        date,
        description,
        receiptUrl,
    })

    return res
        .status(201)
        .json(new ApiResponse(201, expense, "Expense added successfully"))
})

// ─── Get All Expenses ─────────────────────────────────────────────────────────

/**
 * GET /api/expenses
 * Query: ?category=Food&startDate=2024-01-01&endDate=2024-12-31
 */
export const getExpenses = asyncHandler(async (req, res) => {
    const { category, startDate, endDate } = req.query

    const filter = { user: req.user._id }

    if (category) filter.category = category

    if (startDate || endDate) {
        filter.date = {}
        if (startDate) filter.date.$gte = new Date(startDate)
        if (endDate) filter.date.$lte = new Date(endDate)
    }

    const expenses = await Expense.find(filter).sort({ date: -1, createdAt: -1 })

    return res
        .status(200)
        .json(new ApiResponse(200, expenses, "Expenses fetched successfully"))
})

// ─── Get Expense by ID ────────────────────────────────────────────────────────

/**
 * GET /api/expenses/:id
 */
export const getExpenseById = asyncHandler(async (req, res) => {
    const expense = await Expense.findOne({
        _id: req.params.id,
        user: req.user._id,
    })

    if (!expense) {
        throw new ApiError(404, "Expense not found")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, expense, "Expense fetched successfully"))
})

// ─── Update Expense ───────────────────────────────────────────────────────────

/**
 * PATCH /api/expenses/:id
 * Body: { title, amount, category, date, description }
 */
export const updateExpense = asyncHandler(async (req, res) => {
    const { title, amount, category, date, description } = req.body

    if (amount !== undefined && (isNaN(amount) || Number(amount) <= 0)) {
        throw new ApiError(400, "Amount must be a positive number")
    }

    const updatedData = {}
    if (title !== undefined) updatedData.title = title
    if (amount !== undefined) updatedData.amount = Number(amount)
    if (category !== undefined) updatedData.category = category
    if (date !== undefined) updatedData.date = date
    if (description !== undefined) updatedData.description = description

    const expense = await Expense.findOneAndUpdate(
        { _id: req.params.id, user: req.user._id },
        updatedData,
        { new: true, runValidators: true }
    )

    if (!expense) {
        throw new ApiError(404, "Expense not found")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, expense, "Expense updated successfully"))
})

// ─── Delete Expense ───────────────────────────────────────────────────────────

/**
 * DELETE /api/expenses/:id
 */
export const deleteExpense = asyncHandler(async (req, res) => {
    const expense = await Expense.findOneAndDelete({
        _id: req.params.id,
        user: req.user._id,
    })

    if (!expense) {
        throw new ApiError(404, "Expense not found")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Expense deleted successfully"))
})

// ─── Expense Summary (for charts) ────────────────────────────────────────────

/**
 * GET /api/expenses/summary
 * Returns total spend per category for the authenticated user
 */
export const getExpenseSummary = asyncHandler(async (req, res) => {
    const summary = await Expense.aggregate([
        { $match: { user: req.user._id } },
        {
            $group: {
                _id: "$category",
                total: { $sum: "$amount" },
                count: { $sum: 1 },
            },
        },
        { $sort: { total: -1 } },
    ])

    const totalSpend = summary.reduce((acc, s) => acc + s.total, 0)

    return res.status(200).json(
        new ApiResponse(
            200,
            { summary, totalSpend },
            "Summary fetched successfully"
        )
    )
})
