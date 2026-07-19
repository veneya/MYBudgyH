const express = require('express');
const { addIncome, getIncome, deleteIncome, updateIncome } = require('../Controllers/income.Controllers');
const { protect } = require('../middleware/auth.middleware');

const incomeRouter = express.Router();

incomeRouter.post('/add', protect, addIncome);
incomeRouter.get('/get', protect, getIncome);
incomeRouter.delete('/delete/:id', protect, deleteIncome);
incomeRouter.put('/update/:id', protect, updateIncome);

module.exports = incomeRouter;