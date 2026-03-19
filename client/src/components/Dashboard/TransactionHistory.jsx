import React, { useState } from 'react';
import { FaArrowCircleDown, FaArrowCircleUp } from 'react-icons/fa';

const TransactionHistory = () => {
    const [transactions, setTransactions] = useState([
        {
            id: 1,
            title: 'Grocery',
            amount: -1200,
            date: '2025-04-12'
        },
        {
            id: 2,
            title: 'Salary',
            amount: 10000,
            date: '2025-04-10'
        },
        {
            id: 3,
            title: 'Netflix',
            amount: -500,
            date: '2025-04-09'
        },
        {
            id: 4,
            title: 'Freelance',
            amount: 5000,
            date: '2025-04-05'
        }
    ]);

    return (
        <div className="p-6 bg-[#FFF5F7] shadow-lg rounded-3xl w-full border border-pink-200 max-w-lg mx-auto mt-6 min-h-[400px]">
    <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center"> Transaction History</h2>
    <div className="max-h-[400px] overflow-y-auto overflow-x-hidden pr-2"> {/* Add scroll here */}
        <ul className="space-y-4">
            {transactions.map((txn) => (
                <li key={txn.id} className="flex justify-between items-center border p-4 rounded-lg shadow-md bg-white hover:scale-105 hover:bg-gray-50 transition-all ease-in-out">
                    <div className="flex items-center gap-4">
                        {txn.amount < 0 ? (
                            <FaArrowCircleDown className="text-red-500 text-2xl" />
                        ) : (
                            <FaArrowCircleUp className="text-green-500 text-2xl" />
                        )}
                        <div className="text-gray-700 font-medium text-lg">{txn.title}</div>
                    </div>
                    <div className="text-right">
                        <div className={`font-bold text-xl ${txn.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                            ₹{Math.abs(txn.amount).toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">{new Date(txn.date).toLocaleDateString()}</div>
                    </div>
                </li>
            ))}
        </ul>
    </div>
</div>

    );
};

export default TransactionHistory;
