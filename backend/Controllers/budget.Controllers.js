const Budget = require('../models/Budget.models');

// Add budget
const addBudget = async (req, res) => {
    const { category, limit, spent } = req.body;  

    try {
        if (!category || !limit) {
            return res.status(400).json({ message: "Category and limit are required" });
        }

        const budget = new Budget({
            userID: req.user._id,
            category,
            limit,
            spent: spent || 0  
        });

        await budget.save();
        res.status(201).json({ message: "Budget added successfully", budget });
    } catch (error) {
        console.error("Error adding budget:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get all budgets for logged in user
const getBudgets = async (req, res) => {
    try {
        const budgets = await Budget.find({ userID: req.user._id });
        res.status(200).json({ budgets });
    } catch (error) {
        console.error("Error fetching budgets:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Update budget spent amount
const updateBudgetSpent = async (req, res) => {
    const { spent } = req.body;

    try {
        const budget = await Budget.findOneAndUpdate(
            { _id: req.params.id, userID: req.user._id },
            { spent },
            { new: true }
        );

        if (!budget) {
            return res.status(404).json({ message: "Budget not found" });
        }

        res.status(200).json({ message: "Budget updated", budget });
    } catch (error) {
        console.error("Error updating budget:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Delete budget
const deleteBudget = async (req, res) => {
    try {
        const budget = await Budget.findOneAndDelete({
            _id: req.params.id,
            userID: req.user._id
        });

        if (!budget) {
            return res.status(404).json({ message: "Budget not found" });
        }

        res.status(200).json({ message: "Budget deleted successfully" });
    } catch (error) {
        console.error("Error deleting budget:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const updateBudget = async (req, res) => {
    const { category, limit, spent } = req.body;

    try {
        const budget = await Budget.findOneAndUpdate(
            { _id: req.params.id, userID: req.user._id },
            { category, limit, spent },
            { new: true, runValidators: true }
        );

        if (!budget) {
            return res.status(404).json({ message: "Budget not found" });
        }

        res.status(200).json({ message: "Budget updated successfully", budget });
    } catch (error) {
        console.error("Error updating budget:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { addBudget, getBudgets, updateBudgetSpent, deleteBudget, updateBudget };