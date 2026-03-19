const Income = require('../models/Income.models');
const Transaction = require('../models/Transaction.model');

// Add income
const addIncome = async (req, res) => {
    const { title, amount, source, date, paymentMode, details } = req.body;

    try {
        if (!title || !amount || !date) {
            return res.status(400).json({ message: "Title, amount and date are required" });
        }

        const income = new Income({
            userID: req.user._id,
            title,
            amount,
            source,
            date,
            paymentMode,
            details
        });

        await income.save();

        // also save to transaction history
        await Transaction.create({
            userID: req.user._id,
            title,
            amount,
            type: 'income',
            date
        });

        res.status(201).json({ message: "Income added successfully", income });
    } catch (error) {
        console.error("Error adding income:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get all income for logged in user
const getIncome = async (req, res) => {
    try {
        const incomes = await Income.find({ userID: req.user._id }).sort({ date: -1 });
        res.status(200).json({ incomes });
    } catch (error) {
        console.error("Error fetching income:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Delete income
const deleteIncome = async (req, res) => {
    try {
        const income = await Income.findOneAndDelete({
            _id: req.params.id,
            userID: req.user._id
        });

        if (!income) {
            return res.status(404).json({ message: "Income not found" });
        }

        // remove from transactions too
        await Transaction.findOneAndDelete({
            userID: req.user._id,
            title: income.title,
            type: 'income',
            date: income.date
        });

        res.status(200).json({ message: "Income deleted successfully" });
    } catch (error) {
        console.error("Error deleting income:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { addIncome, getIncome, deleteIncome };