import { GoogleGenerativeAI } from "@google/generative-ai"
import { Expense } from "../models/expense.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/AsyncHandler.js"
import { EXPENSE_CATEGORIES } from "../constants.js"

const getGemini = () => {
    if (!process.env.GEMINI_API_KEY) {
        throw new ApiError(503, "AI features are not configured (missing GEMINI_API_KEY)")
    }
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    return genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
}

// ─── Feature 1: Spend Insights ────────────────────────────────────────────────

/**
 * GET /api/ai/insights
 * Fetches last 90 days of expenses and asks Gemini for a personal analysis.
 */
export const getSpendInsights = asyncHandler(async (req, res) => {
    // Fetch last 90 days of expenses
    const since = new Date()
    since.setDate(since.getDate() - 90)

    const expenses = await Expense.find({
        user: req.user._id,
        date: { $gte: since },
    }).sort({ date: -1 })

    if (expenses.length === 0) {
        return res.status(200).json(
            new ApiResponse(
                200,
                { insights: "No expenses found in the last 90 days. Start adding expenses to get AI insights!" },
                "No data to analyze"
            )
        )
    }

    // Build a compact summary for Gemini
    const totalSpend = expenses.reduce((sum, e) => sum + e.amount, 0)
    const byCategory = expenses.reduce((acc, e) => {
        acc[e.category] = (acc[e.category] || 0) + e.amount
        return acc
    }, {})

    const expenseList = expenses
        .slice(0, 30) // cap to 30 items to stay within token limits
        .map((e) => `- ${e.title} | ₹${e.amount} | ${e.category} | ${new Date(e.date).toDateString()}`)
        .join("\n")

    const prompt = `
You are a personal finance assistant. Analyze the following expense data for the last 90 days and give the user:
1. A brief summary of their spending habits (2-3 sentences)
2. Top 2-3 insights or patterns you notice
3. 2-3 actionable suggestions to save money or spend more wisely

User's total spend: ₹${totalSpend.toFixed(2)}
Spending by category: ${JSON.stringify(byCategory, null, 2)}

Recent expenses:
${expenseList}

Keep the tone friendly, concise, and motivating. Format the response in clear sections.
`.trim()

    const model = getGemini()
    const result = await model.generateContent(prompt)
    const insights = result.response.text()

    return res.status(200).json(
        new ApiResponse(200, { insights }, "Insights generated successfully")
    )
})

// ─── Feature 2: Natural Language Expense Entry ───────────────────────────────

/**
 * POST /api/ai/parse-expense
 * Body: { text: "spent 200 on food yesterday" }
 * Returns a structured expense object ready to be saved.
 */
export const parseExpenseFromText = asyncHandler(async (req, res) => {
    const { text } = req.body

    if (!text || text.trim().length === 0) {
        throw new ApiError(400, "text field is required")
    }

    const today = new Date().toISOString().split("T")[0]
    const categoriesList = EXPENSE_CATEGORIES.join(", ")

    const prompt = `
Today's date is ${today}.
Extract expense details from the following user input and return a valid JSON object.

User input: "${text}"

Return ONLY a raw JSON object (no markdown, no code block) with these fields:
{
  "title": "short descriptive title",
  "amount": <number>,
  "category": "<one of: ${categoriesList}>",
  "date": "<ISO date string YYYY-MM-DD>",
  "description": "optional extra context or empty string"
}

Rules:
- "amount" must be a positive number (no currency symbols)
- "category" must exactly match one of the listed categories
- If the date is relative (today, yesterday, last Friday), resolve it to an absolute date based on today's date
- If any field cannot be determined, use sensible defaults: category -> "Other", date -> today's date
`.trim()

    const model = getGemini()
    const result = await model.generateContent(prompt)
    const raw = result.response.text().trim()

    // Strip markdown code fences if Gemini wraps output despite instructions
    const cleaned = raw.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim()

    let parsed
    try {
        parsed = JSON.parse(cleaned)
    } catch {
        throw new ApiError(422, "AI could not parse the expense. Please rephrase and try again.")
    }

    // Validate required fields
    if (!parsed.title || !parsed.amount || parsed.amount <= 0) {
        throw new ApiError(422, "AI returned incomplete expense data. Please be more specific.")
    }

    // Sanitize category
    if (!EXPENSE_CATEGORIES.includes(parsed.category)) {
        parsed.category = "Other"
    }

    return res.status(200).json(
        new ApiResponse(200, parsed, "Expense parsed successfully")
    )
})
