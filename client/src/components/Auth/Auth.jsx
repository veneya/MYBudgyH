import React, { useState } from 'react';
import Login from './Login';
import SignUp from './Signup';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <>
            {isLogin ? (
                <Login onSwitchToSignup={() => setIsLogin(false)} />
            ) : (
                <SignUp onSwitchToLogin={() => setIsLogin(true)} />
            )}
        </>
    );
};

export default Auth;
