const express = require('express');
const { addExpense, getExpenses, deleteExpense } = require('../Controllers/expenses.Controllers');
const { protect } = require('../middleware/auth.middleware');

const expensesRouter = express.Router();

expensesRouter.post('/add', protect, addExpense);
expensesRouter.get('/get', protect, getExpenses);
expensesRouter.delete('/delete/:id', protect, deleteExpense);

module.exports = expensesRouter;