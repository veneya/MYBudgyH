const express = require('express');
const { addBudget, getBudgets, updateBudgetSpent, deleteBudget } = require('../Controllers/budget.Controllers');
const { protect } = require('../middleware/auth.middleware');

const budgetRouter = express.Router();

budgetRouter.post('/add', protect, addBudget);
budgetRouter.get('/get', protect, getBudgets);
budgetRouter.put('/update/:id', protect, updateBudgetSpent);
budgetRouter.delete('/delete/:id', protect, deleteBudget);

module.exports = budgetRouter;