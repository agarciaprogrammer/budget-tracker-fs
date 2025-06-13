import SequelizePkg from 'sequelize';
import sequelize from '../config/db.js';

import UserModel from './User.js';
import ExpenseModel from './Expense.js';
import CategoryModel from './Category.js';
import IncomeModel from './Income.js';
import FixedExpenseModel from './FixedExpense.js';

const { Sequelize } = SequelizePkg;

const User = UserModel(sequelize, Sequelize.DataTypes);
const Expense = ExpenseModel(sequelize, Sequelize.DataTypes);
const Category = CategoryModel(sequelize, Sequelize.DataTypes);
const Income = IncomeModel(sequelize, Sequelize.DataTypes);
const FixedExpense = FixedExpenseModel(sequelize, Sequelize.DataTypes);

const models = { User, Expense, Category, Income, FixedExpense };

// Asociaciones
Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

export {
  sequelize,
  Sequelize,
  User,
  Expense,
  Category,
  Income,
  FixedExpense
};
