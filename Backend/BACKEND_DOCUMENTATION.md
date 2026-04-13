# 🏗️ Expense Tracker — Backend Architecture & Docs

This document provides a complete overview of the backend system, its design patterns, and how the different components interact.

---

## 🚀 1. Tech Stack
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JWT (Stateless) with Dual-Token rotation
- **File Storage**: Multer (Local temp) + Cloudinary (Cloud)
- **AI Engine**: Google Gemini 1.5 Flash

---

## 🏛️ 2. Architectural Design Patterns

### 🔄 Unified Request/Response Cycle
We use three core utility classes to keep the code clean and debuggable:
- **`AsyncHandler.js`**: A wrapper that catches errors in async functions and forwards them to Express, eliminating the need for `try-catch` blocks in every controller.
- **`ApiError.js`**: A standard class for all system errors (400, 401, 404, etc.) to ensure the frontend always receives the same error JSON shape.
- **`ApiResponse.js`**: Ensures all successful responses have a unified structure.

### 🔐 Dual-Token Authentication
Unlike single-token systems, this uses a high-security approach:
1. **Access Token**: Short-lived (2 days), used for authorization.
2. **Refresh Token**: Long-lived (10 days), stored hashed in MongoDB and as an `HttpOnly` cookie for CSRF/XSS protection.
3. **Rotation**: Every time high-privilege actions or renewals occur, a new pair is issued, and the old refresh token is invalidated.

---

## 📁 3. Directory Structure
```text
src/
├── config/      # Env variables & AI configuration
├── constants.js # Shared values (Expense categories)
├── controllers/ # Business logic (Auth, Expense, AI)
├── db/          # Database connection logic
├── middlewares/ # Request filtering (Auth, File upload)
├── models/      # Data schemas (User, Expense)
├── routes/      # URL mapping
├── utils/       # Global helper classes
├── app.js       # App configuration & Global error handling
└── index.js     # Entry point (Starts the server)
```

---

## 🤖 4. AI Features (Gemini Integration)

### 📊 Spend Insights
Analyzes the last 90 days of the user's data. It calculates category totals and sends a prompt to Gemini 1.5 Flash to generate personalized financial advice and saving tips.

### ✍️ Natural Language Entry
Parses raw text like *"Spent 200 on grocery today"* using Gemini. The AI returns a structured JSON object which the frontend uses to pre-fill the transaction form.

---

## 🛣️ 5. API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| POST | `/register` | Create a new user | No |
| POST | `/login` | Get Access Token + Refresh Cookie | No |
| POST | `/refresh-token` | Issue new Access Token via Cookie | No |
| POST | `/logout` | Clear tokens & cookies | **Yes** |
| GET | `/me` | Get current user's profile | **Yes** |

### Expenses (`/api/expenses`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| POST | `/` | Add expense (supports image upload) | **Yes** |
| GET | `/` | Get list (supports category/date filters) | **Yes** |
| GET | `/summary` | Get category-wise spending totals | **Yes** |
| GET | `/:id` | Get single expense details | **Yes** |
| PATCH | `/:id` | Update expense details | **Yes** |
| DELETE | `/:id` | Remove expense | **Yes** |

### AI Utility (`/api/ai`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| GET | `/insights` | AI-generated spending analysis | **Yes** |
| POST | `/parse-expense` | Convert text to structured JSON | **Yes** |

---

## 🛠️ 6. How to Test
1. **IP Whitelist**: Ensure your network is added to MongoDB Atlas.
2. **Start Server**: `npm run dev`.
3. **Auth Flow**: Register -> Login -> Copy `accessToken`.
4. **Header**: Add `Authorization: Bearer <token>` to all protected calls.
5. **Cookies**: If using Postman, the `refreshToken` is managed automatically under the Cookies tab.
