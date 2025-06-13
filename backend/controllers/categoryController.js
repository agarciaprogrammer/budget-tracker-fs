const categoryService = require('../services/categoryService');

const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const userId = req.user.sub;

        const category = await categoryService.createCategory({ name, userId });
        res.status(201).json(category);
    } catch (error) {
        console.error('Error al crear categoría:', error);
        res.status(500).json({ error: 'Failed to create category' });
    }
};

const getAllCategories = async (req, res) => {
    try {
        const categories = await categoryService.getAllCategories(req.user.sub);
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
};

const updateCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedCategory = await categoryService.updateCategory(id, {
            ...req.body,
            userId: req.user.sub
        });
        if (updatedCategory) {
            res.status(200).json(updatedCategory);
        } else {
            res.status(404).json({ error: 'Category not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to update category' });
    }
};

const deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await categoryService.deleteCategory(id, req.user.sub);
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Category not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete category' });
    }
};  

module.exports = {
    createCategory,
    getAllCategories,
    updateCategory,
    deleteCategory
};