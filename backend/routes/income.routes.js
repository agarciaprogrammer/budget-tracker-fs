const express = require('express');
const router = express.Router();
const incomeController = require('../controllers/incomeController');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware);

router.post('/', incomeController.createIncome);
router.get('/', incomeController.getAllIncomes);
router.put('/:id', incomeController.updateIncome);
router.delete('/:id', incomeController.deleteIncome);

module.exports = router;