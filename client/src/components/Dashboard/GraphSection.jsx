import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
    { name: "Jan", spend: 1200 },
    { name: "Feb", spend: 1000 },
    { name: "Mar", spend: 1600 },
    { name: "Apr", spend: 900 },
    { name: "May", spend: 1800 },
    { name: "Jun", spend: 1400 },
];

const GraphSection = () => {
    return (
        // fix: h-[350px] was clipping the chart due to bottom margin offset, increased to h-[380px]
        <div className="bg-white rounded-2xl shadow-md p-6 mt-6 border border-pink-200 w-full h-[380px]">
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
                    <XAxis dataKey="name" interval="preserveStartEnd" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="spend" stroke="#FFB6B9" fill="url(#colorSpend)" strokeWidth={3} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default GraphSection;