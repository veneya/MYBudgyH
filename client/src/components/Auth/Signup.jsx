import React, { useState } from 'react';
import toast from 'react-hot-toast';
import axiosInstance from '../../utils/axiosInstance';
import { validateEmail } from '../../utils/helper';

const SignUp = ({ onSwitchToLogin }) => {
    const [formData, setFormData] = useState({
        userName: '',
        userMailId: '',
        password: '',
        confirmPassword: '',
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
        <div className="flex items-center justify-center min-h-screen">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border border-blue-200">
                <h2 className="text-3xl font-extrabold text-center text-blue-600 mb-6">
                    Create Your Account
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-lg font-semibold text-gray-700 mb-2" htmlFor="userName">
                            Username
                        </label>
                        <input
                            type="text"
                            id="userName"
                            name="userName"
                            value={formData.userName}
                            onChange={handleChange}
                            placeholder="Choose a username"
                            className="w-full px-5 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200 text-gray-700 bg-gray-50"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-lg font-semibold text-gray-700 mb-2" htmlFor="userMailId">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="userMailId"
                            name="userMailId"
                            value={formData.userMailId}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            className="w-full px-5 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200 text-gray-700 bg-gray-50"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-lg font-semibold text-gray-700 mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Create a password"
                            className="w-full px-5 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200 text-gray-700 bg-gray-50"
                            required
                            minLength="6"
                        />
                    </div>

                    <div>
                        <label className="block text-lg font-semibold text-gray-700 mb-2" htmlFor="confirmPassword">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm your password"
                            className="w-full px-5 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200 text-gray-700 bg-gray-50"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-black font-bold py-3 rounded-xl shadow-lg hover:bg-blue-600 transition-all duration-200 ease-in-out focus:ring-4 focus:ring-blue-300 focus:ring-offset-2"
                    >
                        ✨ Sign Up
                    </button>
                </form>

                <p className="text-center text-gray-500 text-sm mt-6">
                    Already have an account?{' '}
                    <button
                        type="button"
                        onClick={onSwitchToLogin}
                        className="text-blue-600 font-bold hover:underline"
                    >
                        Log in
                    </button>
                </p>
            </div>
        </div>
    );
};

export default SignUp;