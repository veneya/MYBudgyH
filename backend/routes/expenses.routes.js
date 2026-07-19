const express = require('express');
const { addExpense, getExpenses, deleteExpense , getMonthlyTrend, updateExpense, getCategoryBreakdown} = require('../Controllers/expenses.Controllers');
const { protect } = require('../middleware/auth.middleware');

const expensesRouter = express.Router();

expensesRouter.post('/add', protect, addExpense);
expensesRouter.get('/get', protect, getExpenses);
expensesRouter.delete('/delete/:id', protect, deleteExpense);
expensesRouter.get('/trend', protect, getMonthlyTrend);
expensesRouter.put('/update/:id', protect, updateExpense); 
expensesRouter.get('/category-breakdown', protect, getCategoryBreakdown);

module.exports = expensesRouter;