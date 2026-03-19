import React, { useState } from 'react';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import GraphSection from './GraphSection';
import TransactionHistory from './TransactionHistory';

const LandingPage = () => {
    const [totalBudget, _setTotalBudget] = useState(15100);
    const [totalSpend, _setTotalSpend] = useState(4830);
    const [totalIncome, _setTotalIncome] = useState(50000); 

    return (
        <div className="flex bg-[#FFF5F7] min-h-screen overflow-x-hidden">
            <Sidebar />
            <div className="flex-1 p-4 md:p-6 overflow-y-auto">
                <MainContent totalBudget={totalBudget} totalSpend={totalSpend} totalIncome={totalIncome} />
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