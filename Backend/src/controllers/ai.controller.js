import { GoogleGenerativeAI } from "@google/generative-ai"
import { Expense } from "../models/expense.model.js"
import { Income } from "../models/income.model.js"
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
    const since = new Date()
    since.setDate(since.getDate() - 90)

    // Fetch last 90 days of expenses and incomes
    const [expenses, incomes] = await Promise.all([
        Expense.find({
            user: req.user._id,
            date: { $gte: since },
        }).sort({ date: -1 }),
        Income.find({
            user: req.user._id,
            date: { $gte: since },
        }).sort({ date: -1 }),
    ])

    if (expenses.length === 0) {
        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    narrative: `Welcome ${req.user?.name || "there"}! Add some expenses to activate the AI Intelligence Engine. Once you log your spending, I will build customized, actionable insights for you.`,
                    items: [
                        {
                            icon: "add_chart",
                            title: "Build your ledger",
                            description: "Add transactions to feed the analysis engine.",
                            urgency: "low",
                        }
                    ],
                    projectedSurplus: 0,
                    burnRisk: "Low",
                    burnRiskDetail: "Add entries to run risk simulations.",
                    lifestyleBalance: { essential: 100, discretionary: 0 },
                    savingsRate: 0,
                },
                "No data to analyze"
            )
        )
    }

    // Build a highly rich aggregated summary for Gemini
    const totalSpend = expenses.reduce((sum, e) => sum + e.amount, 0)
    const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0)
    
    // Monthly income baseline (prefer user's setting, fallback to actuals avg, fallback to 0)
    const baseMonthlyIncome = req.user?.monthlyIncome || (totalIncome > 0 ? totalIncome / 3 : 0)

    const netSavings = totalIncome - totalSpend
    const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : (baseMonthlyIncome > 0 ? ((baseMonthlyIncome - (totalSpend / 3)) / baseMonthlyIncome) * 100 : 0)

    const byCategory = expenses.reduce((acc, e) => {
        acc[e.category] = (acc[e.category] || 0) + e.amount
        return acc
    }, {})

    // Sort to find top categories
    const sortedCategories = Object.entries(byCategory)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([cat, amt]) => `${cat} (${amt.toFixed(2)})`)
        .join(", ")

    const userCurrency = req.user?.currency || "USD"
    const expenseList = expenses
        .slice(0, 30) // cap to 30 items
        .map((e) => `- ${e.title} | ${userCurrency} ${e.amount} | ${e.category} | ${new Date(e.date).toDateString()}`)
        .join("\n")

    const prompt = `
SYSTEM: You are "Financial Atelier Curator", an elite AI private wealth strategist. Your tone is warm, bespoke, highly professional, direct, and actionable. You evaluate data meticulously and do not generalize.

User Context:
- Name: ${req.user?.name || "Member"}
- Standard Monthly Income Setting: ${userCurrency} ${baseMonthlyIncome.toFixed(2)}
- Actual Incomes Logged (Last 90 days): ${userCurrency} ${totalIncome.toFixed(2)}
- Actual Expenses Logged (Last 90 days): ${userCurrency} ${totalSpend.toFixed(2)}
- Calculated Savings Rate: ${savingsRate.toFixed(1)}%
- Top Spending Categories: ${sortedCategories || "None"}
- Spend Categories Breakdown: ${JSON.stringify(byCategory, null, 2)}

Recent Transactions:
${expenseList}

RESPONSE RULES:
- Return ONLY a valid JSON object. Do not wrap it in markdown or comments.
- "narrative": A highly premium, 2-3 sentence analysis addressed directly to ${req.user?.name?.split(" ")[0] || "there"}. Make specific observations about their high spend categories or overall pacing.
- "projectedSurplus": Numerical monthly savings estimate. If actual income is 0 and profile income is 0, estimate 0.
- "burnRisk": "Low" | "Moderate" | "Urgent" based on spending pacing vs actual income or profile income.
- "burnRiskDetail": A single, razor-sharp descriptive sentence stating exactly why their pacing is at this risk level.
- "lifestyleBalance": { "essential": <percentage>, "discretionary": <percentage> } based on their categories (Essential includes Utilities, Food, Health, Education; Discretionary includes Shopping, Entertainment, Travel). Make sure the percentages sum to exactly 100.
- "savingsRate": The exact integer value of their calculated savings rate (e.g. 34). Can be negative if they spent more than they made.
- "items": Array of exactly 3 granular, highly actionable financial suggestions. Each suggestion must have:
  * "icon": A standard material symbols icon name (e.g. "savings", "trending_down", "shopping_bag", "payments", "receipt_long").
  * "title": A short 3-5 word title.
  * "description": A concise, tailored tip referencing their data.
  * "urgency": "low" | "medium" | "high".

JSON SCHEMA EXPECTED:
{
  "narrative": "...",
  "projectedSurplus": 1250,
  "burnRisk": "Low",
  "burnRiskDetail": "...",
  "lifestyleBalance": { "essential": 60, "discretionary": 40 },
  "savingsRate": 34,
  "items": [
    { "icon": "savings", "title": "...", "description": "...", "urgency": "low" }
  ]
}
`.trim()

    const model = getGemini()
    
    let structured
    try {
        const result = await model.generateContent(prompt)
        const raw = result.response.text().trim()
        
        // Robust extraction of JSON
        const jsonMatch = raw.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("No JSON found in AI response")
        }
        
        structured = JSON.parse(jsonMatch[0])
    } catch (error) {
        console.error("GEMINI_INSIGHT_ERROR:", error.message)
        // Dynamic robust fallback using our calculated aggregates
        const simpleSurplus = Math.max(0, baseMonthlyIncome - (totalSpend / 3))
        structured = {
            narrative: `Hello ${req.user?.name?.split(" ")[0] || "there"}. Based on your last 90 days, you spent a total of ${userCurrency} ${totalSpend.toFixed(2)} with top categories being ${sortedCategories || "Other"}. Keep tracking to receive deeper strategist reports.`,
            items: [
                {
                    icon: "trending_up",
                    title: "Active Tracker Pacing",
                    description: `Your regular logged expenses are averaging ${(totalSpend / 3).toFixed(0)} ${userCurrency} per month.`,
                    urgency: "low",
                },
                {
                    icon: "account_balance",
                    title: "Track Income Streams",
                    description: "Add all freelance, investments, and salary inputs under the Income page for a perfect cashflow map.",
                    urgency: "medium",
                },
                {
                    icon: "savings",
                    title: "Target 20% Savings Rate",
                    description: `Your calculated pacing is at a ${savingsRate.toFixed(0)}% savings rate.`,
                    urgency: "low",
                }
            ],
            projectedSurplus: Math.round(simpleSurplus),
            burnRisk: savingsRate < 10 ? "Moderate" : "Low",
            burnRiskDetail: `Currently pacing a ${savingsRate.toFixed(0)}% savings rate relative to cash inflow.`,
            lifestyleBalance: { essential: 65, discretionary: 35 },
            savingsRate: Math.round(savingsRate),
        }
    }

    return res.status(200).json(
        new ApiResponse(200, structured, "Insights calculated successfully")
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
