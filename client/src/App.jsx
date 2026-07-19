import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Auth from './components/Auth/Auth';
import LandingPage from './components/Dashboard/LandingPage';
import Income from './components/Income';
import Expenses from './components/Expenses';
import Budget from './components/Budget';
import ForgotPassword from './components/Auth/ForgotPassword';
import ResetPassword from './components/Auth/ResetPassword';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/" replace />;
};

const App = () => {
    return (
        <BrowserRouter>
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#FFF0F3',
                        color: '#6B305D',
                        border: '1px solid #FFB6B9',
                        borderRadius: '12px',
                    },
                    success: {
                        style: { background: '#FCE4EC', color: '#880E4F', border: '1px solid #F8BBD0' },
                    },
                    error: {
                        style: { background: '#FFEBEE', color: '#B71C1C', border: '1px solid #FFCDD2' },
                    },
                }}
            />
            <Routes>
                <Route path="/" element={<Auth />} />
                <Route path="/dashboard" element={<ProtectedRoute><LandingPage /></ProtectedRoute>} />
                <Route path="/income" element={<ProtectedRoute><Income /></ProtectedRoute>} />
                <Route path="/expenses" element={<ProtectedRoute><Expenses /></ProtectedRoute>} />
                <Route path="/budget" element={<ProtectedRoute><Budget /></ProtectedRoute>} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;