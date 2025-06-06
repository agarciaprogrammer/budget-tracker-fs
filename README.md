# 💸 Budget Tracker - Full Stack App

A personal budgeting and expense management web application. Users can track their income, fixed expenses, daily expenses, and calculate monthly/daily budgets, helping maintain financial awareness and discipline.

## ✨ Features (MVP)

- Monthly view with navigation (← Month →) and current month display.
- Add/Edit/Delete:
  - Income
  - Fixed Expenses
  - Daily Expenses
- Budget Calculations:
  - Budget / Month = Income - Fixed Expenses
  - Budget / Day = Budget / Month ÷ Days in month
  - For each expense: calculate remaining budget and daily balance
- Expense Table with:
  - Date
  - Description
  - Amount
  - Budget (auto-calculated)
  - Balance (auto-calculated)
- Total expenses, remaining monthly budget and balance.
- Automatic detection of the "Sueldo" income to compare vs expenses.
- Personal user accounts (multi-user support with isolation).
- Dashboard with visual charts and summarized metrics.

## 🛠️ Tech Stack

**Frontend**
- React
- TypeScript

**Backend**
- Node.js
- Express
- Sequelize ORM

**Database**
- PostgreSQL

**Authentication**
- JWT (JSON Web Tokens)

**Deployment Suggestions**
- Railway / Render (Backend + DB)
- Vercel (Frontend)

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
- As a user, I want to log my daily expenses with description, date, and amount.
- As a user, I want to see how much I can spend daily and track how my expenses affect my budget.
- As a user, I want to change the month view and see expenses and balances accordingly.
- As a user, I want to visualize my financial activity on a dashboard with charts.
- As a user, I want my data to be secure and only accessible to me.

## ✅ Future Improvements

- Support for multiple currencies
- Recurring expenses/incomes
- Notifications or insights (e.g. "You are overspending")
- Expense categories and filters
- Export to CSV or Excel

