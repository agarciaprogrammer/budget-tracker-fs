const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController.js');
const authMiddleware = require('../middleware/auth.middleware.js');

router.use(authMiddleware);

router.post('/', categoryController.createCategory);
router.get('/', categoryController.getAllCategories);
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;