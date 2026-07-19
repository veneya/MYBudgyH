import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import GraphSection from './GraphSection';
import TransactionHistory from './TransactionHistory';
import PieChartSection from './PieChartSection';
import axiosInstance from '../../utils/axiosInstance';

const parseAmount = (val) => {
    if (!val) return 0;
    if (typeof val === 'object' && val.$numberDecimal) return parseFloat(val.$numberDecimal);
    return Number(val);
};

const LandingPage = () => {
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalSpend, setTotalSpend] = useState(0);
    const totalBalance = totalIncome - totalSpend;

    useEffect(() => {
        const fetchTotals = async () => {
            try {
                const [incomeRes, expensesRes] = await Promise.all([
                    axiosInstance.get('/income/get'),
                    axiosInstance.get('/expenses/get'),
                ]);
                const income = incomeRes.data.incomes.reduce((sum, i) => sum + parseAmount(i.amount), 0);
                const spend = expensesRes.data.expenses.reduce((sum, e) => sum + parseAmount(e.amount), 0);
                setTotalIncome(income);
                setTotalSpend(spend);
            } catch (error) {
                console.error("Error fetching totals:", error);
            }
        };
        fetchTotals();
    }, []);

    return (
        <div className="flex min-h-screen overflow-x-hidden w-full gap-2">
            <Sidebar />
            <div className="flex-1 p-4 md:p-6 overflow-y-auto semi-transparent rounded-2xl">
                <MainContent totalSpend={totalSpend} totalIncome={totalIncome} totalBalance={totalBalance} />
                <div className="flex flex-col lg:flex-row justify-center gap-6 mt-4 px-6">
                    <div className="w-full lg:w-1/2"><TransactionHistory /></div>
                    <div className="w-full lg:w-1/2"><GraphSection /></div>
                </div>
                <div className="mt-4 px-6"><PieChartSection /></div>
            </div>
        </div>
    );
};

export default LandingPage;