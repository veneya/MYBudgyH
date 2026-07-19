require("dotenv").config();
const express = require('express');
const path = require('path');
const rateLimit = require('express-rate-limit');

const app = require('./app');
const connectDB = require('./db');

// Import routes
const authRoutes = require('./routes/auth.routes');
const incomeRoutes = require('./routes/income.routes');
const expensesRoutes = require('./routes/expenses.routes');
const budgetRoutes = require('./routes/budget.routes');
const transactionRoutes = require('./routes/transaction.routes');
const limiter = rateLimit({
    windowMs: 60 * 1000, // 15 minutes
    max: 1000, // limit each IP to 100 requests per windowMs
    message: {
        error: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Import middlewares
const noCache = require('./middleware/noCache.middleware');

const PORT = process.env.PORT || 8000;

app.use('/api', limiter);
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