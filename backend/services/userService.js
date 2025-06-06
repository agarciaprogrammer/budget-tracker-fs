const { User } = require('../models');

const createUser = async (data) => {
  return await User.create(data);
};

const getAllUsers = async () => {
  return await User.findAll();
};

const getUserById = async (id) => {
  return await User.findByPk(id);
};

const getUserByUsername = async (username) => {
  return await User.findOne({ where: { username } });
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  getUserByUsername
};