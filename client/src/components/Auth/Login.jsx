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
        <div className="bg-white/20 backdrop-blur-md rounded-3xl shadow-2xl p-8 md:p-10 border border-white/30">
            <h2 className="text-3xl font-bold text-center text-white mb-2">Welcome Back</h2>
            <p className="text-center text-white/70 text-sm mb-6">Login to your account</p>

            <form onSubmit={handleSubmit} className="space-y-5">
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
                    />
                    <div className="text-right mt-1">
                        <Link to="/forgot-password" className="text-sm text-white/80 hover:text-white hover:underline font-medium">
                            Forgot password?
                        </Link>
                    </div>
                </div>
                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all duration-300 transform hover:scale-[1.02]"
                >
                    Login
                </button>
            </form>

            <p className="text-center text-white/70 text-sm mt-6">
                Don't have an account?{' '}
                <button onClick={onSwitchToSignup} className="text-white font-bold hover:underline">
                    Sign up
                </button>
            </p>
        </div>
    );
};

export default Login;