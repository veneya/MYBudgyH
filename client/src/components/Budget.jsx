import React, { useState, useEffect } from 'react';
import Sidebar from './Dashboard/Sidebar';
import { FaPlus, FaTrash } from 'react-icons/fa';
import axiosInstance from '../utils/axiosInstance';

const parseAmount = (val) => {
    if (!val) return 0;
    if (typeof val === 'object' && val.$numberDecimal) return parseFloat(val.$numberDecimal);
    return Number(val);
};

const Budget = () => {
    const [budgets, setBudgets] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        category: '',
        limit: '',
        spent: '',
    });

    const fetchBudgets = async () => {
        try {
            const res = await axiosInstance.get('/budget/get');
            setBudgets(res.data.budgets);
        } catch (error) {
            console.error("Error fetching budgets:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBudgets();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.category || !formData.limit) return;

        try {
            await axiosInstance.post('/budget/add', {
                category: formData.category,
                limit: parseFloat(formData.limit),
                spent: parseFloat(formData.spent) || 0,
            });
            setFormData({ category: '', limit: '', spent: '' });
            setShowForm(false);
            fetchBudgets();
        } catch (error) {
            console.error("Error adding budget:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axiosInstance.delete(`/budget/delete/${id}`);
            fetchBudgets();
        } catch (error) {
            console.error("Error deleting budget:", error);
        }
    };

    const totalLimit = budgets.reduce((sum, b) => sum + parseAmount(b.limit), 0);
    const totalSpent = budgets.reduce((sum, b) => sum + parseAmount(b.spent), 0);

    return (
        <div className="flex bg-[#FFF5F7] min-h-screen">
            <Sidebar />
            <div className="flex-1 p-6 overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-[#ff008c]">Budgets</h1>
                        <p className="text-[#A68BA0] text-sm">Set and track your spending limits</p>
                    </div>
                    <button onClick={() => setShowForm(!showForm)}
                        className="flex items-center gap-2 bg-pink-500 text-white px-4 py-2 rounded-xl hover:bg-pink-600 transition">
                        <FaPlus /> Add Budget
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="bg-[#EAC4D5] rounded-2xl p-5 shadow-md">
                        <p className="text-[#6B305D] font-semibold">Total Budget Limit</p>
                        <p className="text-4xl font-bold text-[#6B305D]">₹{totalLimit.toLocaleString()}</p>
                    </div>
                    <div className="bg-[#FFC1CC] rounded-2xl p-5 shadow-md">
                        <p className="text-[#6B305D] font-semibold">Total Spent</p>
                        <p className="text-4xl font-bold text-[#6B305D]">₹{totalSpent.toLocaleString()}</p>
                    </div>
                </div>

                {showForm && (
                    <div className="bg-white rounded-2xl p-6 shadow-md border border-pink-200 mb-6">
                        <h2 className="text-xl font-bold text-pink-600 mb-4">Add New Budget</h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="text-sm font-semibold text-gray-600">Category</label>
                                <input name="category" value={formData.category} onChange={handleChange}
                                    placeholder="e.g. Food" required
                                    className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-300 outline-none text-gray-700 bg-gray-50" />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-600">Budget Limit (₹)</label>
                                <input name="limit" type="number" value={formData.limit} onChange={handleChange}
                                    placeholder="0" required min="0"
                                    className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-300 outline-none text-gray-700 bg-gray-50" />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-600">Amount Spent (₹)</label>
                                <input name="spent" type="number" value={formData.spent} onChange={handleChange}
                                    placeholder="0" min="0"
                                    className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-300 outline-none text-gray-700 bg-gray-50" />
                            </div>
                            <div className="sm:col-span-3 flex gap-3 justify-end">
                                <button type="button" onClick={() => setShowForm(false)}
                                    className="px-5 py-2 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-100">Cancel</button>
                                <button type="submit"
                                    className="px-5 py-2 rounded-xl bg-pink-500 text-white hover:bg-pink-600 font-semibold">Save Budget</button>
                            </div>
                        </form>
                    </div>
                )}

                {loading ? (
                    <div className="text-center text-[#A68BA0] mt-16"><p>Loading...</p></div>
                ) : budgets.length === 0 ? (
                    <div className="text-center text-[#A68BA0] mt-16">
                        <p className="text-5xl mb-4">🐷</p>
                        <p className="text-lg font-semibold">No budgets set yet</p>
                        <p className="text-sm">Click "Add Budget" to set your spending limits</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {budgets.map((budget) => {
                            const limit = parseAmount(budget.limit);
                            const spent = parseAmount(budget.spent);
                            const percentage = Math.min((spent / limit) * 100, 100);
                            const isOver = spent > limit;
                            return (
                                <div key={budget._id} className="bg-white rounded-xl px-5 py-4 shadow-sm border border-pink-100">
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="font-semibold text-gray-700">{budget.category}</p>
                                        <div className="flex items-center gap-4">
                                            <p className={`font-bold ${isOver ? 'text-red-500' : 'text-green-500'}`}>
                                                ₹{spent.toLocaleString()} / ₹{limit.toLocaleString()}
                                            </p>
                                            <button onClick={() => handleDelete(budget._id)} className="text-red-400 hover:text-red-600">
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-3">
                                        <div className={`h-3 rounded-full transition-all ${isOver ? 'bg-red-400' : 'bg-pink-400'}`}
                                            style={{ width: `${percentage}%` }} />
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {isOver ? '⚠️ Over budget!' : `₹${(limit - spent).toLocaleString()} remaining`}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Budget;