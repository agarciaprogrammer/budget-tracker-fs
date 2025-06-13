const express = require('express');
const router = express.Router();
const fixedExpenseController = require('../controllers/fixedExpenseController');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware);

router.post('/', fixedExpenseController.createFixedExpense);
router.get('/', fixedExpenseController.getAllFixedExpenses);
router.get('/user/:userId', fixedExpenseController.getFixedExpensesByUserId);
router.put('/:id', fixedExpenseController.updateFixedExpense);
router.delete('/:id', fixedExpenseController.deleteFixedExpense);

module.exports = router;

