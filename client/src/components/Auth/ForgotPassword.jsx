import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import axiosInstance from '../../utils/axiosInstance';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axiosInstance.post('/auth/forgot-password', { userMailId: email });
            toast.success('Reset link sent to your email! Check your inbox.');
            setEmail('');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border border-pink-200">
                <h2 className="text-3xl font-extrabold text-center text-pink-600 mb-6">Reset Password</h2>
                <p className="text-center text-gray-600 mb-4">Enter your email and we'll send you a reset link.</p>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-lg font-semibold text-gray-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your registered email"
                            className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-400 outline-none text-gray-700 bg-gray-50"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-pink-500 text-black font-bold py-3 rounded-xl hover:bg-pink-600 transition disabled:opacity-50"
                    >
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>
                <p className="text-center text-gray-500 text-sm mt-6">
                    Remember your password? <Link to="/" className="text-pink-600 font-bold hover:underline">Log in</Link>
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;