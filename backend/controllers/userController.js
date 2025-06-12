// controllers/userController.js
const userService = require('../services/userService');

const createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const users = await userService.getUserById(req.params.id);
    if (!users) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getUserByEmail = async (req, res) => {
  try {
    const users = await userService.getUserByEmail(req.params.email);
    if (!users) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createUser, getAllUsers, getUserById, getUserByEmail };