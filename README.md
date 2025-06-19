# 💸 Budget Tracker - Full Stack App

A personal budgeting and expense management web application. Users can track their income, fixed expenses, daily expenses, and calculate monthly/daily budgets, helping maintain financial awareness and discipline.

## ✨ Features (MVP)

- Monthly view with navigation (← Month →) and current month display.
- Add/Edit/Delete:
  - Income
  - Fixed Expenses
  - Daily Expenses
- Budget Calculations
- Expense Table
- Total expenses, remaining monthly budget and balance.
- Automatic detection of the "Sueldo" income to compare vs expenses.
- Personal user accounts (multi-user support with isolation).
- Dashboard with visual charts and summarized metrics.
- Category selector for each expense, enabling future categorization and visual distribution.
- **CRUD of Custom Categories** (per user)
- **Category filtering** in expense views
- **Recurring expenses** (e.g. subscriptions, rent)
- **Spending distribution by category** (pie or bar charts)
- **Monthly comparisons** (spending evolution)
- **Advanced filtering/searching** in tables

## 🛠️ Tech Stack

**Frontend**
- React
- TypeScript
- Vite
- Axios

**Backend**
- Node.js
- Express
- Sequelize ORM

**Database**
- PostgreSQL (Supabase)

**Authentication**
- JWT (JSON Web Tokens)

**Deployment**
- Vercel (Frontend)
- Render (Backend)
- Supabase (Database)

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (local development)
- npm or yarn

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd budget-tracker-fs
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   # Create .env file with your database credentials
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   # Create .env file with VITE_API_URL=http://localhost:3001/api
   npm run dev
   ```

4. **Database Setup**
   - Create a PostgreSQL database
   - Update `backend/config/config.json` with your database credentials
   - The tables will be created automatically when you start the backend

## 📱 Screens (MVP)

| Screen        | Description |
|---------------|-------------|
| **Login/Register** | User authentication |
| **Dashboard** | Key metrics, summary cards and financial charts |
| **Expenses** | Monthly expense table, navigation by month |
| **Incomes** | List and CRUD of all incomes |
| **Fixed Expenses** | Manage monthly fixed costs |

## 🧠 User Stories

- As a user, I want to register and log in to access my personal budget data.
- As a user, I want to input my income and fixed expenses to calculate my budget.
- As a user, I want to log my daily expenses with description, date, amount, and category.
- As a user, I want to see how much I can spend daily and track how my expenses affect my budget.
- As a user, I want to change the month view and see expenses and balances accordingly.
- As a user, I want to visualize my financial activity on a dashboard with charts.
- As a user, I want my data to be secure and only accessible to me.

## 🌐 Deployment

This application is configured for deployment on:
- **Frontend**: Vercel
- **Backend**: Render
- **Database**: Supabase (PostgreSQL)

For detailed deployment instructions, see [DEPLOYMENT-SUPABASE.md](./DEPLOYMENT-SUPABASE.md)

### Environment Variables

**Frontend (.env)**
```
VITE_API_URL=http://localhost:3001/api
```

**Backend (.env) - Development**
```
NODE_ENV=development
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=budget_tracker
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173
```

**Backend (.env) - Production**
```
NODE_ENV=production
DATABASE_URL=postgresql://postgres:password@host:5432/postgres
JWT_SECRET=your_jwt_secret
FRONTEND_URL=https://your-app.vercel.app
```

## 🔮 Future Features (Roadmap)

### 💡 Expense Management Enhancements
- **Tags (free-form labels)** for more flexible classification
- **Payment Method field** (cash, credit card, debit, etc.)
- **Expense Notes** for additional details

### 📊 Data Insights & Visualization
- **Budgets by category** (set spending limits)
- **Saving goals tracking**
- **Balance evolution graph** (daily change)

### 🧰 Usability & Export
- **Export/Import data** (CSV, Excel)
- **Dark Mode / Light Mode**

## 📝 License

This project is licensed under the MIT License.
