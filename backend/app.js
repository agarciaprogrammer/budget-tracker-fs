const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./config/db');

// Routes (require)
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const expenseRoutes = require('./routes/expense.routes');
const categoryRoutes = require('./routes/category.routes');
const incomeRoutes = require('./routes/income.routes');

const app = express();

app.use(cors());
app.use(express.json());

// Routes (app.use)
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/categories', categoryRoutes); 
app.use('/api/incomes', incomeRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('ExpoArt API funcionando');
});

module.exports = app;
