const mongoose = require('mongoose');

const IncomeSchema = new mongoose.Schema(
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

        amount: {
            type: mongoose.Schema.Types.Decimal128,
            required: true
        },

        source: {
            type: String,
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

        details: {
            type: String
        }

    }, { timestamps: true }
);

const Income = mongoose.model('Income', IncomeSchema);
module.exports = Income;