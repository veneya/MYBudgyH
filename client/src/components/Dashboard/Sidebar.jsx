import React from "react";
import { FaHome, FaWallet, FaShoppingBag, FaSignOutAlt, FaPiggyBank } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import logo from '../../assets/logo.png';
import ProfilePhotoSelector from "./ProfilePhotoSelector";

const Sidebar = () => {
    const navigate = useNavigate();
    return (
        <div className="w-64 min-h-screen semi-transparent-sidebar shadow-lg flex flex-col items-center py-2 rounded-2xl">
            <div className="h-20 w-full flex justify-center items-center">
                <img src={logo} alt="MyBudgyH Logo" className="w-full h-40 object-contain" />
            </div>
            <div className="mb-6"><ProfilePhotoSelector /></div>
            <div className="w-4/5 h-px bg-gray-300 mb-4" />
            <ul className="space-y-5 text-sm font-semibold text-gray-700 w-full px-8">
                <li className="flex items-center space-x-3 hover:text-purple-400 cursor-pointer" onClick={() => navigate('/dashboard')}>
                    <FaHome /> <span>Dashboard</span>
                </li>
                <li className="flex items-center space-x-3 hover:text-purple-400 cursor-pointer" onClick={() => navigate('/income')}>
                    <FaWallet /> <span>Income</span>
                </li>
                <li className="flex items-center space-x-3 hover:text-purple-400 cursor-pointer" onClick={() => navigate('/expenses')}>
                    <FaShoppingBag /> <span>Expenses</span>
                </li>
                <li className="flex items-center space-x-3 hover:text-purple-400 cursor-pointer" onClick={() => navigate('/budget')}>
                    <FaPiggyBank /> <span>Budgets</span>
                </li>
                <li
                    className="flex items-center space-x-3 hover:text-red-500 cursor-pointer"
                    onClick={() => {
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        navigate('/');
                    }}
                >
                    <FaSignOutAlt /> <span>Logout</span>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;