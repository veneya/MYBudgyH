const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema(
    {
        userID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
            // ✅ removed `unique: true` – now user can have many budgets (one per category)
        },

        category: {
            type: String,
            required: true,
            trim: true
        },

        limit: {
            type: mongoose.Schema.Types.Decimal128,
            required: true,
            min: 0
        },

        spent: {
            type: mongoose.Schema.Types.Decimal128,
            default: 0.0,
            min: 0
        }

    }, 
    { timestamps: true }
);

// ✅ optional: ensure one budget per category per user
BudgetSchema.index({ userID: 1, category: 1 }, { unique: true });

const Budget = mongoose.model("Budget", BudgetSchema);
module.exports = Budget;