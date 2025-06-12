const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController.js');
const authMiddleware = require('../middleware/auth.middleware.js');

router.use(authMiddleware);

router.post('/', expenseController.createExpense);
router.get('/', expenseController.getAllExpenses);
router.put('/:id', expenseController.updateExpense);
router.delete('/:id', expenseController.deleteExpense);

module.exports = router;