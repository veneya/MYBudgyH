const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema(
    {
        userID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },

        totalIncome: {
            type: mongoose.Schema.Types.Decimal128,
            default: 0.0,
            required: true
        },

        totalExpense: {
            type: mongoose.Schema.Types.Decimal128,
            default: 0.0,
            required: true
        },

        balance: {
            type: mongoose.Schema.Types.Decimal128,
            default: 0.0,
            required: true
        },

        incomeUpdatedAt: {
            type: Date
        },

        expenseUpdatedAt: {
            type: Date
        }

    }, { timestamps: true }
);

const Budget = mongoose.model("Budget", BudgetSchema);
module.exports = Budget;