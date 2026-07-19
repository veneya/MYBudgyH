import React, { useState } from 'react';
import toast from 'react-hot-toast';
import axiosInstance from '../../utils/axiosInstance';
import { validateEmail } from '../../utils/helper';

const SignUp = ({ onSwitchToLogin }) => {
    const [formData, setFormData] = useState({
        userName: '', userMailId: '', password: '', confirmPassword: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.userName || !formData.userMailId || !formData.password || !formData.confirmPassword) {
            toast.error('Please fill in all fields.');
            return;
        }
        if (!validateEmail(formData.userMailId)) {
            toast.error('Please enter a valid email address.');
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match.');
            return;
        }
        try {
            await axiosInstance.post('/auth/register', {
                userName: formData.userName,
                userMailId: formData.userMailId,
                password: formData.password,
            });
            toast.success('Sign-up successful! 🎉 Redirecting...');
            setFormData({ userName: '', userMailId: '', password: '', confirmPassword: '' });
            setTimeout(() => onSwitchToLogin(), 1500);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Sign-up failed. Please try again.');
        }
    };

    return (
        <div className="bg-white/20 backdrop-blur-md rounded-3xl shadow-2xl p-8 md:p-10 border border-white/30">
            <h2 className="text-3xl font-bold text-center text-white mb-2">Create Account</h2>
            <p className="text-center text-white/70 text-sm mb-6">Start managing your expenses</p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-semibold text-white/90 mb-1">Username</label>
                    <input
                        type="text"
                        name="userName"
                        value={formData.userName}
                        onChange={handleChange}
                        placeholder="Your username"
                        className="w-full px-4 py-3 border border-white/30 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none text-gray-800 bg-white/80 backdrop-blur-sm transition"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-white/90 mb-1">Email Address</label>
                    <input
                        type="email"
                        name="userMailId"
                        value={formData.userMailId}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className="w-full px-4 py-3 border border-white/30 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none text-gray-800 bg-white/80 backdrop-blur-sm transition"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-white/90 mb-1">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 border border-white/30 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none text-gray-800 bg-white/80 backdrop-blur-sm transition"
                        required
                        minLength="6"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-white/90 mb-1">Confirm Password</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 border border-white/30 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none text-gray-800 bg-white/80 backdrop-blur-sm transition"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all duration-300 transform hover:scale-[1.02]"
                >
                    Create Account
                </button>
            </form>

            <p className="text-center text-white/70 text-sm mt-6">
                Already have an account?{' '}
                <button onClick={onSwitchToLogin} className="text-white font-bold hover:underline">
                    Log in
                </button>
            </p>
        </div>
    );
};

export default SignUp;