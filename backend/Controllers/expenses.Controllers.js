const Expenses = require('../models/Expenses.models');
const Transaction = require('../models/Transaction.model');

// Add expense
const addExpense = async (req, res) => {
    const { title, amount, category, date, paymentMode, details } = req.body;

    try {
        if (!title || !amount || !date) {
            return res.status(400).json({ message: "Title, amount and date are required" });
        }

        const expense = new Expenses({
            userID: req.user._id,
            title,
            amount,
            category,
            date,
            paymentMode,
            details
        });

        await expense.save();

        // also save to transaction history
        await Transaction.create({
            userID: req.user._id,
            title,
            amount,
            type: 'expense',
            date
        });

        res.status(201).json({ message: "Expense added successfully", expense });
    } catch (error) {
        console.error("Error adding expense:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get all expenses for logged in user
const getExpenses = async (req, res) => {
    try {
        const expenses = await Expenses.find({ userID: req.user._id }).sort({ date: -1 });
        res.status(200).json({ expenses });
    } catch (error) {
        console.error("Error fetching expenses:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Delete expense
const deleteExpense = async (req, res) => {
    try {
        const expense = await Expenses.findOneAndDelete({
            _id: req.params.id,
            userID: req.user._id
        });

        if (!expense) {
            return res.status(404).json({ message: "Expense not found" });
        }

        // remove from transactions too
        await Transaction.findOneAndDelete({
            userID: req.user._id,
            title: expense.title,
            type: 'expense',
            date: expense.date
        });

        res.status(200).json({ message: "Expense deleted successfully" });
    } catch (error) {
        console.error("Error deleting expense:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { addExpense, getExpenses, deleteExpense };