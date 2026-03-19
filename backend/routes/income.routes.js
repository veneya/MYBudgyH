const express = require('express');
const { addIncome, getIncome, deleteIncome } = require('../Controllers/income.Controllers');
const { protect } = require('../middleware/auth.middleware');

const incomeRouter = express.Router();

incomeRouter.post('/add', protect, addIncome);
incomeRouter.get('/get', protect, getIncome);
incomeRouter.delete('/delete/:id', protect, deleteIncome);

module.exports = incomeRouter;