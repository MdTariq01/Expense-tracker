# 💰 Expense Tracker

A full-stack expense tracking application with AI-powered insights, real-time analytics, and intelligent expense categorization. Built with a modern MERN stack (MongoDB, Express, React, Node.js) enhanced with Google Gemini AI for smart financial analysis.

---

## ✨ Features

### 💳 Core Expense Management
- **Add Expenses**: Create expense entries with category, amount, description, and optional image upload
- **View Expenses**: Browse all expenses with filtering by category and date range
- **Edit & Delete**: Modify or remove expenses seamlessly
- **Category Management**: Pre-defined categories (Food, Transportation, Entertainment, Health, Education, etc.)

### 🤖 AI-Powered Features
- **Spend Insights**: Get personalized financial advice based on 90-day spending analysis using Google Gemini 1.5 Flash
- **Natural Language Parsing**: Enter expenses in plain text (e.g., "Spent $50 on groceries") and AI automatically parses and categorizes them
- **Smart Recommendations**: AI generates actionable saving tips and financial insights

### 📊 Analytics & Visualization
- **Dashboard**: Real-time overview of spending trends and patterns
- **Category Breakdown**: Donut chart showing spending distribution across categories
- **Trend Analysis**: Line chart visualizing spending patterns over time
- **Radar Chart**: Multi-dimensional view of spending across categories
- **Summary Statistics**: Total spending, category totals, and comparison metrics

### 🔐 Security & Authentication
- **JWT Authentication**: Secure stateless authentication with dual-token system
- **Access Tokens**: Short-lived (2 days) for authorized requests
- **Refresh Tokens**: Long-lived (10 days), stored securely as HttpOnly cookies
- **Token Rotation**: Automatic token refresh with old token invalidation
- **Password Hashing**: Bcrypt encryption for secure password storage
- **Protected Routes**: Role-based access control for sensitive operations

### 📧 Email Integration
- **Email Verification**: Confirm email during registration
- **Password Reset**: Secure password recovery workflow
- **Email Notifications**: Transaction receipts and account updates

### ☁️ Cloud Integration
- **Cloudinary**: Cloud-based image storage for expense receipts and attachments
- **CDN Delivery**: Fast global image delivery

---

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js v5.2+
- **Database**: MongoDB with Mongoose v9+
- **Authentication**: JWT (jsonwebtoken)
- **Security**: Helmet.js, bcryptjs, CORS
- **File Upload**: Multer
- **Cloud Storage**: Cloudinary
- **AI Engine**: Google Generative AI (Gemini 1.5 Flash)
- **Email**: Nodemailer & Resend
- **Pagination**: Mongoose Aggregate Paginate

### Frontend
- **Framework**: React 19+
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6+
- **HTTP Client**: Axios
- **Charts**: Chart.js with react-chartjs-2
- **Linting**: ESLint

---

## 📁 Project Structure

```
Expense-tracker/
├── Backend/
│   ├── src/
│   │   ├── config/          # Environment & AI configuration
│   │   ├── controllers/      # Business logic (Auth, Expense, AI)
│   │   ├── models/           # MongoDB schemas (User, Expense)
│   │   ├── routes/           # API endpoints
│   │   ├── middlewares/      # Auth, File upload handlers
│   │   ├── services/         # External services (Mail, etc.)
│   │   ├── utils/            # Helper classes (ApiError, ApiResponse, AsyncHandler)
│   │   ├── db/               # Database connection
│   │   ├── app.js            # Express app setup & global error handler
│   │   ├── constants.js      # Shared constants
│   │   └── index.js          # Server entry point
│   ├── public/               # Static files
│   ├── package.json
│   └── BACKEND_DOCUMENTATION.md
│
└── Frontend/
    ├── src/
    │   ├── components/       # Reusable React components
    │   ├── pages/            # Full page components
    │   ├── context/          # React Context (Auth)
    │   ├── api/              # Axios instance & API calls
    │   ├── assets/           # Images, icons, etc.
    │   ├── App.jsx           # Main app component
    │   └── main.jsx          # React entry point
    ├── public/               # Static assets
    ├── index.html
    ├── package.json
    └── vite.config.js
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v20+)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)
- Google Cloud API key (for Gemini AI)
- Cloudinary account (for image storage)
- Email service (Nodemailer/Resend credentials)

### Installation

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd Expense-tracker
```

#### 2. Backend Setup

```bash
cd Backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

**Configure `.env` file:**
```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>

# JWT Secrets
ACCESS_TOKEN_SECRET=your_access_token_secret_here
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
ACCESS_TOKEN_EXPIRY=2d
REFRESH_TOKEN_EXPIRY=10d

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Service (Nodemailer or Resend)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
# OR for Resend
RESEND_API_KEY=your_resend_api_key

# CORS
CLIENT_URL=http://localhost:5173
```

#### 3. Frontend Setup

```bash
cd Frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

**Configure `.env` file:**
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🏃 Running the Application

### Start Backend Server
```bash
cd Backend
npm run dev
```
Server runs on: `http://localhost:5000`

### Start Frontend Development Server
```bash
cd Frontend
npm run dev
```
Frontend runs on: `http://localhost:5173`

### Build for Production

**Backend**: Backend is ready for deployment as-is.

**Frontend**:
```bash
cd Frontend
npm run build
npm run preview  # Test production build locally
```

---

## 📡 API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/register` | Create new user account |
| POST | `/login` | User login & token generation |
| POST | `/refresh-token` | Refresh access token |
| POST | `/logout` | User logout & token invalidation |
| GET | `/me` | Get current user profile |

### Expenses (`/api/expenses`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/` | Add new expense (with image upload) |
| GET | `/` | Get expense list (with filters) |
| GET | `/summary` | Get category-wise spending totals |
| GET | `/:id` | Get expense details |
| PATCH | `/:id` | Update expense |
| DELETE | `/:id` | Delete expense |

### AI Features (`/api/ai`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/insights` | Get AI-generated spending insights |
| POST | `/parse-expense` | Parse text to structured expense |

---

## 🔐 Authentication Flow

1. **Registration**: User creates account with email and password
2. **Login**: Credentials validated, dual tokens generated
3. **Access Token**: Stored in frontend state, sent with each request
4. **Refresh Token**: Stored as HttpOnly cookie for security
5. **Token Refresh**: Automatic renewal when access token expires
6. **Logout**: Both tokens invalidated, cookies cleared

---

## 🎨 Key Features in Detail

### Smart Expense Parsing
Convert natural language to structured expenses:
```
Input: "Spent $50 on groceries at Walmart today"
Output: {
  amount: 50,
  category: "Food",
  description: "groceries at Walmart",
  date: "2024-05-18"
}
```

### AI-Powered Insights
Analyzes 90 days of spending data and provides:
- Category-wise spending analysis
- Budget recommendations
- Saving opportunities
- Spending pattern insights

### Analytics Dashboard
- Real-time spending dashboard
- Category breakdown visualization
- Trend analysis charts
- Budget tracking
- Monthly comparisons

---

## 🧪 Testing

### Backend Testing
```bash
cd Backend
# Manual testing with Postman or curl

# Example: Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

### Frontend Testing
```bash
cd Frontend
npm run lint  # Run ESLint
```

---

## 🚢 Deployment

### Backend Deployment (Vercel, Railway, Render)
1. Ensure all environment variables are set
2. Database connection is MongoDB Atlas
3. Deploy as Node.js application

### Frontend Deployment (Vercel, Netlify)
1. Build: `npm run build`
2. Deploy the `dist/` folder
3. Set environment variables in deployment platform

---

## 📝 Environment Variables

### Backend `.env`
```
PORT
NODE_ENV
MONGODB_URI
ACCESS_TOKEN_SECRET
REFRESH_TOKEN_SECRET
GEMINI_API_KEY
CLOUDINARY_*
EMAIL_*
CLIENT_URL
```

### Frontend `.env`
```
VITE_API_URL
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📚 Additional Documentation

- [Backend Architecture](./Backend/BACKEND_DOCUMENTATION.md) - Detailed backend design and patterns
- [API Documentation](./Backend/BACKEND_DOCUMENTATION.md) - Complete API reference

---

## 👨‍💻 Author

**Mohammad Tariq**

---

## 🙏 Acknowledgments

- [Google Gemini AI](https://ai.google.dev/) for intelligent insights
- [Cloudinary](https://cloudinary.com/) for image management
- [MongoDB](https://www.mongodb.com/) for database
- [React](https://react.dev/) & [Express.js](https://expressjs.com/) communities

---

## 📞 Support

For issues or questions:
1. Check existing issues on GitHub
2. Create a new issue with detailed description
3. Contact: officialmdtariq01@gmail.com

---

**Happy Expense Tracking! 💸**
