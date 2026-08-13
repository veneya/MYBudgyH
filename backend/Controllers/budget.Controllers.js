const Budget = require('../models/Budget.models');

const MAX_AMOUNT = 1_000_000_000_000;

// ========== ADD BUDGET ==========
const addBudget = async (req, res) => {
    const { category, limit, spent } = req.body;
    try {
        if (!category || !limit) {
            return res.status(400).json({ message: "Category and limit are required" });
        }
        const limitNum = parseFloat(limit);
        const spentNum = parseFloat(spent) || 0;
        if (isNaN(limitNum) || limitNum < 0 || limitNum > MAX_AMOUNT) {
            return res.status(400).json({
                message: `Limit must be between 0 and ${MAX_AMOUNT.toLocaleString()}`
            });
        }
        if (spentNum < 0 || spentNum > MAX_AMOUNT) {
            return res.status(400).json({
                message: `Spent must be between 0 and ${MAX_AMOUNT.toLocaleString()}`
            });
        }

        const existingBudget = await Budget.findOne({
            userID: req.user._id,
            category: new RegExp(`^${String(category).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i')
        });
        if (existingBudget) {
            return res.status(400).json({ message: `Budget for ${category} already exists` });
        }

        const budget = new Budget({
            userID: req.user._id,
            category,
            limit: limitNum,
            spent: spentNum
        });
        await budget.save();
        res.status(201).json({ message: "Budget added successfully", budget });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "Budget already exists for this category" });
        }
        console.error("Error adding budget:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ========== GET BUDGETS ==========
const getBudgets = async (req, res) => {
    try {
        const budgets = await Budget.find({ userID: req.user._id });
        res.status(200).json({ budgets });
    } catch (error) {
        console.error("Error fetching budgets:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ========== UPDATE BUDGET SPENT ==========
const updateBudgetSpent = async (req, res) => {
    const { spent } = req.body;
    try {
        const spentNum = parseFloat(spent);
        if (isNaN(spentNum) || spentNum < 0 || spentNum > MAX_AMOUNT) {
            return res.status(400).json({
                message: `Spent must be between 0 and ${MAX_AMOUNT.toLocaleString()}`
            });
        }
        const budget = await Budget.findOneAndUpdate(
            { _id: req.params.id, userID: req.user._id },
            { spent: spentNum },
            { new: true }
        );
        if (!budget) {
            return res.status(404).json({ message: "Budget not found" });
        }
        res.status(200).json({ message: "Budget updated", budget });
    } catch (error) {
        console.error("Error updating budget spent:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ========== DELETE BUDGET ==========
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

// ========== UPDATE BUDGET (full update) ==========
const updateBudget = async (req, res) => {
    const { category, limit, spent } = req.body;
    try {
        if (limit !== undefined && limit !== null && limit !== '') {
            const limitNum = parseFloat(limit);
            if (isNaN(limitNum) || limitNum < 0 || limitNum > MAX_AMOUNT) {
                return res.status(400).json({
                    message: `Limit must be between 0 and ${MAX_AMOUNT.toLocaleString()}`
                });
            }
        }
        const hasSpent = spent !== undefined && spent !== null && spent !== '';
        if (hasSpent) {
            const spentNum = parseFloat(spent);
            if (isNaN(spentNum) || spentNum < 0 || spentNum > MAX_AMOUNT) {
                return res.status(400).json({
                    message: `Spent must be between 0 and ${MAX_AMOUNT.toLocaleString()}`
                });
            }
        }
        if (category) {
            const existingBudget = await Budget.findOne({
                userID: req.user._id,
                category: new RegExp(`^${String(category).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i'),
                _id: { $ne: req.params.id }
            });
            if (existingBudget) {
                return res.status(400).json({ message: `Budget for ${category} already exists` });
            }
        }
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
