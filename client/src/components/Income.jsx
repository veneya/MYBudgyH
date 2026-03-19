import React from 'react';
import Sidebar from "./Dashboard/Sidebar";

const Income = () => {
    return (
        <div className='flex'>
            <Sidebar />
            <div className='flex-1'>
                <h1>Income Page</h1>
            </div>
        </div>
    );
};

export default Income;