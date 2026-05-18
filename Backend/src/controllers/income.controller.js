import { Income } from "../models/income.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/AsyncHandler.js"

// ─── Add Income ───────────────────────────────────────────────────────────────

export const addIncome = asyncHandler(async (req, res) => {
    const { title, amount, category, date, description, isRecurring, recurringFrequency } = req.body

    if (!title || !amount) {
        throw new ApiError(400, "Title and amount are required")
    }
    if (isNaN(amount) || Number(amount) <= 0) {
        throw new ApiError(400, "Amount must be a positive number")
    }

    const income = await Income.create({
        user: req.user._id,
        title,
        amount: Number(amount),
        category: category || "Other",
        date: date || new Date(),
        description,
        isRecurring: Boolean(isRecurring),
        recurringFrequency: isRecurring ? recurringFrequency : null,
    })

    return res.status(201).json(new ApiResponse(201, income, "Income added successfully"))
})

// ─── Get All Incomes ──────────────────────────────────────────────────────────

export const getIncomes = asyncHandler(async (req, res) => {
    const { category, startDate, endDate } = req.query

    const filter = { user: req.user._id }
    if (category) filter.category = category
    if (startDate || endDate) {
        filter.date = {}
        if (startDate) filter.date.$gte = new Date(startDate)
        if (endDate) filter.date.$lte = new Date(endDate)
    }

    const incomes = await Income.find(filter).sort({ date: -1, createdAt: -1 })

    return res.status(200).json(new ApiResponse(200, incomes, "Incomes fetched successfully"))
})

// ─── Update Income ────────────────────────────────────────────────────────────

export const updateIncome = asyncHandler(async (req, res) => {
    const { title, amount, category, date, description, isRecurring, recurringFrequency } = req.body

    if (amount !== undefined && (isNaN(amount) || Number(amount) <= 0)) {
        throw new ApiError(400, "Amount must be a positive number")
    }

    const updatedData = {}
    if (title !== undefined) updatedData.title = title
    if (amount !== undefined) updatedData.amount = Number(amount)
    if (category !== undefined) updatedData.category = category
    if (date !== undefined) updatedData.date = date
    if (description !== undefined) updatedData.description = description
    if (isRecurring !== undefined) updatedData.isRecurring = Boolean(isRecurring)
    if (recurringFrequency !== undefined) updatedData.recurringFrequency = recurringFrequency

    const income = await Income.findOneAndUpdate(
        { _id: req.params.id, user: req.user._id },
        updatedData,
        { new: true, runValidators: true }
    )

    if (!income) throw new ApiError(404, "Income record not found")

    return res.status(200).json(new ApiResponse(200, income, "Income updated successfully"))
})

// ─── Delete Income ────────────────────────────────────────────────────────────

export const deleteIncome = asyncHandler(async (req, res) => {
    const income = await Income.findOneAndDelete({ _id: req.params.id, user: req.user._id })

    if (!income) throw new ApiError(404, "Income record not found")

    return res.status(200).json(new ApiResponse(200, null, "Income deleted successfully"))
})

// ─── Income Summary (monthly breakdown + net savings) ─────────────────────────

export const getIncomeSummary = asyncHandler(async (req, res) => {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)

    // Total income this month
    const monthlyIncomes = await Income.find({
        user: req.user._id,
        date: { $gte: startOfMonth, $lte: endOfMonth },
    })

    const totalIncomeThisMonth = monthlyIncomes.reduce((sum, i) => sum + i.amount, 0)

    // All-time income by category
    const byCategory = await Income.aggregate([
        { $match: { user: req.user._id } },
        { $group: { _id: "$category", total: { $sum: "$amount" }, count: { $sum: 1 } } },
        { $sort: { total: -1 } },
    ])

    // Total all-time income
    const totalIncome = byCategory.reduce((sum, c) => sum + c.total, 0)

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                byCategory,
                totalIncome,
                totalIncomeThisMonth,
                month: now.toLocaleString("en-US", { month: "long", year: "numeric" }),
            },
            "Income summary fetched"
        )
    )
})
