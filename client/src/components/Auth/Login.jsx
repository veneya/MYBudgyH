import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from 'react-hot-toast';
import axiosInstance from "../../utils/axiosInstance";

const Login = ({ onSwitchToSignup }) => {
    const [formData, setFormData] = useState({ userMailId: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.userMailId || !formData.password) {
            toast.error('Please fill in all fields.');
            return;
        }
        try {
            const res = await axiosInstance.post('/auth/login', {
                userMailId: formData.userMailId,
                password: formData.password,
            });
            localStorage.setItem('token', res.data.user.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            toast.success('Login successful! 🎉');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Invalid credentials');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border border-pink-200">
                <h2 className="text-3xl font-extrabold text-center text-pink-600 mb-6">Please Login to Start</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-lg font-semibold text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            name="userMailId"
                            value={formData.userMailId}
                            onChange={handleChange}
                            placeholder="Enter your registered email"
                            className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-400 outline-none text-gray-700 bg-gray-50"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-lg font-semibold text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-400 outline-none text-gray-700 bg-gray-50"
                            required
                        />
                        <div className="text-right mt-1">
                            <Link to="/forgot-password" className="text-sm text-pink-500 hover:underline">Forgot password?</Link>
                        </div>
                    </div>
                    <button type="submit" className="w-full bg-pink-500 text-black font-bold py-3 rounded-xl shadow-lg hover:bg-pink-600 transition">💖 Log in</button>
                </form>
                <p className="text-center text-gray-500 text-sm mt-6">
                    Don't have an account? <button onClick={onSwitchToSignup} className="text-pink-600 font-bold hover:underline">Sign up</button>
                </p>
            </div>
        </div>
    );
};

export default Login;