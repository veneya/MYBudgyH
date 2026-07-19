import React, { useState } from 'react';
import Login from './Login';
import SignUp from './Signup';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
            {/* Dark overlay to improve readability */}
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-0"></div>

            {/* Content – centered */}
            <div className="relative z-10 w-full max-w-md px-4">
                {/* Brand Header */}
                <div className="text-center mb-8">
                    <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg">
                        MyBudgyH
                    </h1>
                    <p className="text-lg md:text-xl text-white/80 font-light tracking-widest mt-1">
                        Your Personal Expense Tracker
                    </p>
                </div>

                {/* Auth Card – Login or Signup */}
                {isLogin ? (
                    <Login onSwitchToSignup={() => setIsLogin(false)} />
                ) : (
                    <SignUp onSwitchToLogin={() => setIsLogin(true)} />
                )}
            </div>
        </div>
    );
};

export default Auth;