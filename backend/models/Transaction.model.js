const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    title: {                        
        type: String,
        required: true
    },

    amount: {
        type: mongoose.Schema.Types.Decimal128,
        required: true
    },

    type: {
        type: String,
        enum: ["income", "expense"],
        required: true
    },

    date: {
        type: Date,
        required: true
    }

}, { timestamps: true });

const Transaction = mongoose.model('Transaction', TransactionSchema);
module.exports = Transaction;