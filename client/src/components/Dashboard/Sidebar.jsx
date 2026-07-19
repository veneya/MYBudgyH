import React from "react";
import { FaHome, FaWallet, FaShoppingBag, FaSignOutAlt, FaPiggyBank, FaLinkedin } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import logo from '../../assets/logo.png';
import ProfilePhotoSelector from "./ProfilePhotoSelector";

const Sidebar = () => {
    const navigate = useNavigate();

    return (
        <div className="w-64 min-h-screen semi-transparent-sidebar shadow-lg flex flex-col items-center py-2 rounded-2xl">
            {/* Logo */}
            <div className="h-20 w-full flex justify-center items-center">
                <img src={logo} alt="MyBudgyH Logo" className="w-full h-40 object-contain" />
            </div>

            {/* Profile photo picker */}
            <div className="mb-6">
                <ProfilePhotoSelector />
            </div>

            {/* Divider */}
            <div className="w-4/5 h-px bg-gray-300 mb-4" />

            {/* Navigation links – flex-1 pushes footer to bottom */}
            <ul className="space-y-5 text-sm font-semibold text-gray-700 w-full px-8 flex-1">
                <li
                    className="flex items-center space-x-3 hover:text-purple-400 cursor-pointer"
                    onClick={() => navigate('/dashboard')}
                >
                    <FaHome /> <span>Dashboard</span>
                </li>
                <li
                    className="flex items-center space-x-3 hover:text-purple-400 cursor-pointer"
                    onClick={() => navigate('/income')}
                >
                    <FaWallet /> <span>Income</span>
                </li>
                <li
                    className="flex items-center space-x-3 hover:text-purple-400 cursor-pointer"
                    onClick={() => navigate('/expenses')}
                >
                    <FaShoppingBag /> <span>Expenses</span>
                </li>
                <li
                    className="flex items-center space-x-3 hover:text-purple-400 cursor-pointer"
                    onClick={() => navigate('/budget')}
                >
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

            {/* ✅ Footer – Author credit */}
            <div className="mt-6 pt-4 border-t border-gray-300 w-4/5 text-center text-xs text-gray-500">
                <p className="mb-1">Made with ❤️ by</p>
                <a
                    href="https://linkedin.com/in/veneya"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pink-500 font-semibold hover:underline inline-flex items-center gap-1"
                >
                    <FaLinkedin className="text-sm" /> Veneya
                </a>
            </div>
        </div>
    );
};

export default Sidebar;