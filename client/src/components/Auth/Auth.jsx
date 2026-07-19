import React, { useState } from 'react';
import Login from './Login';
import SignUp from './Signup';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <>
            {/* 🎯 Brand Header – matches the app's pink theme */}
            <div className="fixed top-0 left-0 w-full z-50 pointer-events-none mt-6">
                <div className="text-center">
                    <h1 className="text-5xl md:text-6xl font-extrabold text-pink-500 drop-shadow-lg tracking-tight">
                        MyBudgyH
                    </h1>
                    <p className="text-lg md:text-xl text-pink-400/90 font-medium tracking-wider mt-1">
                        Your Personal Expense Tracker
                    </p>
                </div>
            </div>

            {/* The login/signup forms – they already have margins/padding */}
            <div className="pt-28 pb-8">
                {isLogin ? (
                    <Login onSwitchToSignup={() => setIsLogin(false)} />
                ) : (
                    <SignUp onSwitchToLogin={() => setIsLogin(true)} />
                )}
            </div>
        </>
    );
};

export default Auth;