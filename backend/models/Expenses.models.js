const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema(
    {
        userID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },

        title: {
            type: String,
            required: true,
            lowercase: true,
            trim: true
        },

        category: {
            type: String,
            required: true,
            enum: ["Food", "Transport", "Shopping", "Bills", "Health", "Entertainment", "Other"] 
        },

        amount: {
            type: mongoose.Schema.Types.Decimal128, 
            required: true
        },

        date: {
            type: Date,
            required: true
        },

        paymentMode: {
            type: String,
            required: true,
            enum: ["UPI", "Cash", "Wallet", "Other"] 
        },

        icon: {
            type: String
        },

        details: {
            type: String
        }

    }, { timestamps: true }
);

const Expenses = mongoose.model('Expenses', ExpenseSchema);
module.exports = Expenses;