const Income = require('../models/Income.models');
const Expenses = require('../models/Expenses.models');

const getTransactions = async (req, res) => {
    try {
        // Fetch both incomes and expenses for the logged-in user
        const [incomes, expenses] = await Promise.all([
            Income.find({ userID: req.user._id }).lean(),
            Expenses.find({ userID: req.user._id }).lean()
        ]);

        // Add a 'type' field and format them
        const formattedIncomes = incomes.map(i => ({
            ...i,
            type: 'income',
        }));
        const formattedExpenses = expenses.map(e => ({
            ...e,
            type: 'expense',
        }));

        // Merge and sort by date (newest first)
        const allTransactions = [...formattedIncomes, ...formattedExpenses];
        allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

        res.status(200).json({ transactions: allTransactions });
    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { getTransactions };