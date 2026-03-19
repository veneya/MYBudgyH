import React from 'react';
import Sidebar from "./Dashboard/Sidebar";

const Expenses = () => {
    return (
        <div className='flex'>
            <Sidebar />
            <div className='flex-1'>
                <h1>Expenses</h1>
            </div>
        </div>
    );
};

export default Expenses;