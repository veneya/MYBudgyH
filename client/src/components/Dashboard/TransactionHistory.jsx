import React, { useState, useEffect } from 'react';
import { FaArrowCircleDown, FaArrowCircleUp } from 'react-icons/fa';
import axiosInstance from '../../utils/axiosInstance';

const TransactionHistory = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const res = await axiosInstance.get('/auth/transactions');
                setTransactions(res.data.transactions);
            } catch (error) {
                console.error("Error fetching transactions:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    return (
        <div className="p-6 bg-[#FFF5F7] shadow-lg rounded-3xl w-full border border-pink-200 max-w-lg mx-auto mt-6 min-h-[400px]">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">Transaction History</h2>

            {loading ? (
                <div className="flex flex-col items-center justify-center h-64 text-[#A68BA0]">
                    <p className="text-lg">Loading...</p>
                </div>
            ) : transactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-[#A68BA0]">
                    <p className="text-5xl mb-4">📋</p>
                    <p className="font-semibold text-lg">No transactions yet</p>
                    <p className="text-sm">Your transactions will appear here</p>
                </div>
            ) : (
                <div className="max-h-[400px] overflow-y-auto overflow-x-hidden pr-2">
                    <ul className="space-y-4">
                        {transactions.map((txn) => (
                            <li key={txn._id} className="flex justify-between items-center border p-4 rounded-lg shadow-md bg-white hover:scale-105 hover:bg-gray-50 transition-all ease-in-out">
                                <div className="flex items-center gap-4">
                                    {txn.type === 'expense' ? (
                                        <FaArrowCircleDown className="text-red-500 text-2xl" />
                                    ) : (
                                        <FaArrowCircleUp className="text-green-500 text-2xl" />
                                    )}
                                    <div className="text-gray-700 font-medium text-lg">{txn.title}</div>
                                </div>
                                <div className="text-right">
                                    <div className={`font-bold text-xl ${txn.type === 'expense' ? 'text-red-600' : 'text-green-600'}`}>
                                        {txn.type === 'expense' ? '-' : '+'}₹{Number(txn.amount).toLocaleString()}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {new Date(txn.date).toLocaleDateString()}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default TransactionHistory;