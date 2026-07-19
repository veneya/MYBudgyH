const Expenses = require('../models/Expenses.models');
const Transaction = require('../models/Transaction.model');
const Budget = require('../models/Budget.models');   // ✅ Budget model imported

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

        // ✅ AUTO‑UPDATE BUDGET SPENT
        // Find budget for this category and update spent
        if (category) {
            const budget = await Budget.findOne({
                userID: req.user._id,
                category: category
            });

            if (budget) {
                const currentSpent = parseFloat(budget.spent) || 0;
                const newSpent = currentSpent + parseFloat(amount);
                budget.spent = newSpent;
                await budget.save();
                console.log(`✅ Budget updated: ${category} spent now ₹${newSpent}`);
            } else {
                console.log(`ℹ️ No budget found for category: ${category}`);
            }
        }

        // Save to transaction history
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

        // Remove from transactions
        await Transaction.findOneAndDelete({
            userID: req.user._id,
            title: expense.title,
            type: 'expense',
            date: expense.date
        });

        // ⚠️ (Optional) You might want to subtract the amount from budget spent as well,
        // but that's a choice – if you delete an expense, the budget spent should decrease.
        // If you want this, uncomment the block below:
        /*
        if (expense.category) {
            const budget = await Budget.findOne({ userID: req.user._id, category: expense.category });
            if (budget) {
                budget.spent = Math.max(0, parseFloat(budget.spent) - parseFloat(expense.amount));
                await budget.save();
            }
        }
        */

        res.status(200).json({ message: "Expense deleted successfully" });
    } catch (error) {
        console.error("Error deleting expense:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get monthly spending trend for the logged-in user
const getMonthlyTrend = async (req, res) => {
    try {
        const result = await Expenses.aggregate([
            {
                $match: {
                    userID: req.user._id
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$date" },
                        month: { $month: "$date" }
                    },
                    totalSpend: { $sum: "$amount" }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        const data = result.map(item => ({
            month: monthNames[item._id.month - 1],
            spend: Number(item.totalSpend)
        }));

        res.status(200).json({ trend: data });
    } catch (error) {
        console.error("Error fetching monthly trend:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const updateExpense = async (req, res) => {
    const { title, amount, category, date, paymentMode, details } = req.body;

    try {
        const expense = await Expenses.findOneAndUpdate(
            { _id: req.params.id, userID: req.user._id },
            { title, amount, category, date, paymentMode, details },
            { new: true, runValidators: true }
        );

        if (!expense) {
            return res.status(404).json({ message: "Expense not found" });
        }

        // ✅ Also update the transaction record
        await Transaction.findOneAndUpdate(
            { userID: req.user._id, title: expense.title, type: 'expense', date: expense.date },
            { title, amount, date }
        );

        res.status(200).json({ message: "Expense updated successfully", expense });
    } catch (error) {
        console.error("Error updating expense:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get expense breakdown by category for pie chart
const getCategoryBreakdown = async (req, res) => {
    try {
        const result = await Expenses.aggregate([
            { $match: { userID: req.user._id } },
            {
                $group: {
                    _id: "$category",
                    total: { $sum: "$amount" }
                }
            },
            { $sort: { total: -1 } }
        ]);

        const data = result.map(item => ({
            name: item._id,
            value: Number(item.total)
        }));

        // Add colors for each category
        const colors = ['#FFB6B9', '#FDE2FF', '#EAC4D5', '#FFC1CC', '#FFE066', '#A68BA0', '#FF8A9B'];
        const formattedData = data.map((item, index) => ({
            ...item,
            color: colors[index % colors.length]
        }));

        res.status(200).json({ data: formattedData });
    } catch (error) {
        console.error("Error fetching category breakdown:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { addExpense, getExpenses, deleteExpense, getMonthlyTrend, updateExpense, getCategoryBreakdown };
