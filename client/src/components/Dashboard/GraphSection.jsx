import React, { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import axiosInstance from "../../utils/axiosInstance";

const GraphSection = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrend = async () => {
            try {
                const res = await axiosInstance.get('/expenses/trend');
                setData(res.data.trend);
            } catch (error) {
                console.error("Error fetching spending trend:", error);
                setData([]);
            } finally {
                setLoading(false);
            }
        };
        fetchTrend();
    }, []);

    if (loading) return <div className="semi-transparent rounded-2xl shadow-md p-6 mt-6 border border-pink-200 w-full h-[380px] flex items-center justify-center"><p className="text-[#A68BA0]">Loading...</p></div>;
    if (data.length === 0) return (
        <div className="semi-transparent rounded-2xl shadow-md p-6 mt-6 border border-pink-200 w-full h-[380px] flex flex-col items-center justify-center">
            <p className="text-5xl mb-4">📊</p>
            <p className="text-lg font-semibold text-gray-600">No spending data yet</p>
            <p className="text-sm text-gray-400">Add some expenses to see your trend</p>
        </div>
    );

    return (
        <div className="semi-transparent rounded-2xl shadow-md p-6 mt-6 border border-pink-200 w-full h-[380px]">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Spending Trend</h2>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                    <defs>
                        <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#FFB6B9" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#FFE066" stopOpacity={0.4} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                    <XAxis dataKey="month" interval="preserveStartEnd" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="spend" stroke="#FFB6B9" fill="url(#colorSpend)" strokeWidth={3} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default GraphSection;