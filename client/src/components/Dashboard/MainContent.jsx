import React from "react";

const MainContent = ({ totalSpend = 0, totalIncome = 0, totalBalance = 0 }) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userName = user?.userName || "there";

    return (
        <div className="p-6 mt-4 semi-transparent rounded-2xl shadow-md border border-pink-200">
            <h1 className="text-3xl font-bold text-[#ff008c]">Hi, {userName} ❤️</h1>
            <p className="text-[#A68BA0]">Here's what's happening with your money, let's manage your expenses.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
                <div className="bg-[#FFC1CC]/70 p-4 rounded-xl shadow-md text-[#6B305D]">
                    <h3 className="text-lg font-semibold">Total Balance</h3>
                    <p className="text-2xl font-bold">₹{totalBalance}</p>
                </div>
                <div className="bg-[#FDE2FF]/70 p-4 rounded-xl shadow-md text-[#6B305D]">
                    <h3 className="text-lg font-semibold">Total Spend</h3>
                    <p className="text-2xl font-bold">₹{totalSpend}</p>
                </div>
                <div className="bg-[#EAC4D5]/70 p-4 rounded-xl shadow-md text-[#6B305D]">
                    <h3 className="text-lg font-semibold">Total Income</h3>
                    <p className="text-2xl font-bold">₹{totalIncome}</p>
                </div>
            </div>
        </div>
    );
};

export default MainContent;