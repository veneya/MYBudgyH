require("dotenv").config();
const express = require('express');
const path = require('path');
const app = require('./app');
const connectDB = require('./db');

// Import routes
const authRoutes = require('./routes/auth.routes');
const incomeRoutes = require('./routes/income.routes');
const expensesRoutes = require('./routes/expenses.routes');
const budgetRoutes = require('./routes/budget.routes');
const transactionRoutes = require('./routes/transaction.routes');

// Import middlewares
const noCache = require('./middleware/noCache.middleware');

const PORT = process.env.PORT || 8000;

app.use('/api', noCache);

app.use('/api/auth', authRoutes);
app.use('/api/income', incomeRoutes);
app.use('/api/expenses', expensesRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/transactions', transactionRoutes);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch((error) => {
    console.error(error);
});