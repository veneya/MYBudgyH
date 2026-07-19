import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import axiosInstance from '../../utils/axiosInstance';

const PieChartSection = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axiosInstance.get('/expenses/category-breakdown');
                setData(res.data.data);
            } catch (error) {
                console.error("Error fetching category breakdown:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="semi-transparent rounded-2xl shadow-md p-6 border border-pink-200 w-full h-[350px] flex items-center justify-center"><p>Loading chart...</p></div>;
    if (data.length === 0) return (
        <div className="semi-transparent rounded-2xl shadow-md p-6 border border-pink-200 w-full h-[350px] flex flex-col items-center justify-center">
            <p className="text-5xl mb-4">📊</p>
            <p className="text-lg font-semibold text-gray-600">No expense data</p>
            <p className="text-sm text-gray-400">Add expenses to see breakdown</p>
        </div>
    );

    return (
        <div className="semi-transparent rounded-2xl shadow-md p-6 border border-pink-200 w-full h-[380px]">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Expense Breakdown</h2>
            <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                    <Pie data={data} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={80} dataKey="value">
                        {data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color || '#FFB6B9'} />)}
                    </Pie>
                    <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PieChartSection;