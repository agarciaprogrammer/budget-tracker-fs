const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');
const authMiddleware = require('../middleware/auth.middleware.js');

router.use(authMiddleware);

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.get('/:email', userController.getUserByEmail);
router.post('/', userController.createUser);

module.exports = router;