require("dotenv").config();
const app = require('./app');
const connectDB = require('./db');

const authRoutes = require('./routes/auth.routes');
const incomeRoutes = require('./routes/income.routes');
const expensesRoutes = require('./routes/expenses.routes');
const budgetRoutes = require('./routes/budget.routes');

const PORT = process.env.PORT || 8000;

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/income', incomeRoutes);
app.use('/api/expenses', expensesRoutes);
app.use('/api/budget', budgetRoutes);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch((error) => {
    console.error(error);
});