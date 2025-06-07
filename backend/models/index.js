import SequelizePkg from 'sequelize';
import sequelize from '../config/db.js';

import UserModel from './User.js';
import ExpenseModel from './Expense.js';
import CategoryModel from './Category.js';

const { Sequelize } = SequelizePkg;

const User = UserModel(sequelize, Sequelize.DataTypes);
const Expense = ExpenseModel(sequelize, Sequelize.DataTypes);
const Category = CategoryModel(sequelize, Sequelize.DataTypes);

const models = { User, Expense, Category };

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
  Category
};
