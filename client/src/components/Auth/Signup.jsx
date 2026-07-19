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
    // ... JSX similar to Login (with signup fields)
    // I'll provide the full code in a separate message if needed.
};
export default SignUp;