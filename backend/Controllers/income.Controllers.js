const Income = require('../models/Income.models');
const Transaction = require('../models/Transaction.model');

const MAX_AMOUNT = 1_000_000_000_000;

// ========== ADD INCOME ==========
const addIncome = async (req, res) => {
    const { title, amount, source, date, paymentMode, details } = req.body;
    try {
        if (!title || !amount || !date) {
            return res.status(400).json({ message: "Title, amount and date are required" });
        }
        const amountNum = parseFloat(amount);
        if (isNaN(amountNum) || amountNum < 0 || amountNum > MAX_AMOUNT) {
            return res.status(400).json({
                message: `Amount must be between 0 and ${MAX_AMOUNT.toLocaleString()}`
            });
        }

        const income = new Income({
            userID: req.user._id,
            title,
            amount: amountNum,
            source,
            date,
            paymentMode,
            details
        });
        await income.save();
        await Transaction.create({
            userID: req.user._id,
            title,
            amount: amountNum,
            type: 'income',
            date
        });
        res.status(201).json({ message: "Income added successfully", income });
    } catch (error) {
        console.error("Error adding income:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ========== GET INCOMES ==========
const getIncome = async (req, res) => {
    try {
        const incomes = await Income.find({ userID: req.user._id }).sort({ date: -1 });
        res.status(200).json({ incomes });
    } catch (error) {
        console.error("Error fetching income:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ========== DELETE INCOME ==========
const deleteIncome = async (req, res) => {
    try {
        const income = await Income.findOneAndDelete({
            _id: req.params.id,
            userID: req.user._id
        });
        if (!income) {
            return res.status(404).json({ message: "Income not found" });
        }
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

// ========== UPDATE INCOME ==========
const updateIncome = async (req, res) => {
    const { title, amount, source, date, paymentMode, details } = req.body;
    try {
        let amountNum = null;
        if (amount !== undefined && amount !== null && amount !== '') {
            amountNum = parseFloat(amount);
            if (isNaN(amountNum) || amountNum < 0 || amountNum > MAX_AMOUNT) {
                return res.status(400).json({
                    message: `Amount must be between 0 and ${MAX_AMOUNT.toLocaleString()}`
                });
            }
        }
        const existing = await Income.findOne({ _id: req.params.id, userID: req.user._id });
        if (!existing) {
            return res.status(404).json({ message: "Income not found" });
        }

        const income = await Income.findOneAndUpdate(
            { _id: req.params.id, userID: req.user._id },
            { title, amount, source, date, paymentMode, details },
            { new: true, runValidators: true }
        );
        if (!income) {
            return res.status(404).json({ message: "Income not found" });
        }
        const newAmount = amountNum !== null ? amountNum : Number(existing.amount);

        // Update the matching transaction using the OLD title/date values
        await Transaction.findOneAndUpdate(
            { userID: req.user._id, title: existing.title, type: 'income', date: existing.date },
            { title: title || existing.title, amount: newAmount, date: date || existing.date }
        );

        res.status(200).json({ message: "Income updated successfully", income });
    } catch (error) {
        console.error("Error updating income:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { addIncome, getIncome, deleteIncome, updateIncome };
