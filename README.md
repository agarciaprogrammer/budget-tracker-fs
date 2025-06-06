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
- As a user, I want to log my daily expenses with description, date, amount, and category.
- As a user, I want to see how much I can spend daily and track how my expenses affect my budget.
- As a user, I want to change the month view and see expenses and balances accordingly.
- As a user, I want to visualize my financial activity on a dashboard with charts.
- As a user, I want my data to be secure and only accessible to me.

## 🔮 Future Features (Roadmap)

### 💡 Expense Management Enhancements
- **CRUD of Custom Categories** (per user)
- **Category filtering** in expense views
- **Tags (free-form labels)** for more flexible classification
- **Payment Method field** (cash, credit card, debit, etc.)
- **Expense Notes** for additional details
- **Recurring expenses** (e.g. subscriptions, rent)

### 📊 Data Insights & Visualization
- **Spending distribution by category** (pie or bar charts)
- **Monthly comparisons** (spending evolution)
- **Budgets by category** (set spending limits)
- **Saving goals tracking**
- **Balance evolution graph** (daily change)

### 🧰 Usability & Export
- **Advanced filtering/searching** in tables
- **Export/Import data** (CSV, Excel)
- **Dark Mode / Light Mode**
