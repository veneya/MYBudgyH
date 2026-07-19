const express = require('express');
const { getTransactions } = require('../Controllers/transaction.Controllers');
const { protect } = require('../middleware/auth.middleware');

const transactionRouter = express.Router();

transactionRouter.get('/get', protect, getTransactions);

module.exports = transactionRouter;