import React from "react";
import Sidebar from "./Dashboard/Sidebar";

const Budget = () => {
    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1">
                <h1>Budget</h1>
            </div>
        </div>
    );
};

export default Budget;