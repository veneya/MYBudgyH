import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import GraphSection from './GraphSection';
import TransactionHistory from './TransactionHistory';
import axiosInstance from '../../utils/axiosInstance';

const LandingPage = () => {
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalSpend, setTotalSpend] = useState(0);
    const [totalBudget, setTotalBudget] = useState(0);

    useEffect(() => {
        const fetchTotals = async () => {
            try {
                const [incomeRes, expensesRes, budgetRes] = await Promise.all([
                    axiosInstance.get('/income/get'),
                    axiosInstance.get('/expenses/get'),
                    axiosInstance.get('/budget/get'),
                ]);

                const income = incomeRes.data.incomes.reduce((sum, i) => sum + Number(i.amount), 0);
                const spend = expensesRes.data.expenses.reduce((sum, e) => sum + Number(e.amount), 0);
                const budget = budgetRes.data.budgets.reduce((sum, b) => sum + Number(b.limit), 0);

                setTotalIncome(income);
                setTotalSpend(spend);
                setTotalBudget(budget);
            } catch (error) {
                console.error("Error fetching totals:", error);
            }
        };

        fetchTotals();
    }, []);

    return (
        <div className="flex bg-[#FFF5F7] min-h-screen overflow-x-hidden">
            <Sidebar />
            <div className="flex-1 p-4 md:p-6 overflow-y-auto">
                <MainContent
                    totalBudget={totalBudget}
                    totalSpend={totalSpend}
                    totalIncome={totalIncome}
                />
                <div className="flex flex-col lg:flex-row justify-center gap-6 mt-4 px-6">
                    <div className="w-full lg:w-1/2">
                        <TransactionHistory />
                    </div>
                    <div className="w-full lg:w-1/2">
                        <GraphSection />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;