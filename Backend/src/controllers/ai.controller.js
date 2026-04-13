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
                { narrative: "No expenses found in the last 90 days. Start adding expenses to get AI insights!", items: [] },
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

    const userCurrency = req.user?.currency || "USD"
    const expenseList = expenses
        .slice(0, 30) // cap to 30 items to stay within token limits
        .map((e) => `- ${e.title} | ${userCurrency} ${e.amount} | ${e.category} | ${new Date(e.date).toDateString()}`)
        .join("\n")

    const prompt = `
SYSTEM: You are a elite personal financial advisor. Your task is to analyze the user's spending patterns and provide actionable insights.
User: ${req.user?.name || "Member"}
Total Spend (90 days): ${userCurrency} ${totalSpend.toFixed(2)}
Categories: ${JSON.stringify(byCategory, null, 2)}
Merchant Activity:
${expenseList}

RESPONSE RULES:
- Return ONLY a valid JSON object.
- "narrative": A high-quality 2-4 sentence analysis starting with a warm greeting to ${req.user?.name || "there"}. Mention specific categories or merchants if relevant.
- "projectedSurplus": Numerical estimate of savings relative to monthly income (${req.user?.monthlyIncome || 0}).
- "burnRisk": "Low" | "Moderate" | "Urgent" based on spending vs income.
- "burnRiskDetail": One descriptive sentence.
- "lifestyleBalance": { "essential": <percentage>, "discretionary": <percentage> }
- "items": Array of 3 specific financial tips. Use material symbol icons.

JSON FORMAT:
{
  "narrative": "...",
  "projectedSurplus": 0,
  "burnRisk": "Low",
  "burnRiskDetail": "...",
  "lifestyleBalance": { "essential": 60, "discretionary": 40 },
  "items": [
    { "icon": "...", "title": "...", "description": "...", "urgency": "low" }
  ]
}
`.trim()

    const model = getGemini()
    
    let structured
    try {
        const result = await model.generateContent(prompt)
        const raw = result.response.text().trim()
        
        // ROBUST EXTRACTION: Use regex to find the first { and last }
        const jsonMatch = raw.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("No JSON found in AI response")
        }
        
        structured = JSON.parse(jsonMatch[0])
    } catch (error) {
        console.error("GEMINI_INSIGHT_ERROR:", error.message)
        // Fallback if AI fails or returns invalid JSON
        structured = {
            narrative: "The AI engine is currently refining your analysis. Please try again in a few minutes.",
            items: [
                {
                    icon: "refresh",
                    title: "Analysis in Progress",
                    description: "We're currently processing your latest transactions for deeper insights.",
                    urgency: "medium"
                }
            ],
            projectedSurplus: 0,
            burnRisk: "Moderate",
            burnRiskDetail: "Risk analysis will refresh shortly.",
            lifestyleBalance: { essential: 50, discretionary: 50 }
        }
    }

    return res.status(200).json(
        new ApiResponse(200, structured, "Insights attempt completed")
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
