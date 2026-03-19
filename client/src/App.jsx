import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './components/Auth/Auth';
import LandingPage from './components/Dashboard/LandingPage';
import Income from './components/Income';
import Expenses from './components/Expenses';
import Budget from './components/Budget';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/" replace />;
};

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Auth />} />
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <LandingPage />
                    </ProtectedRoute>
                } />
                <Route path="/income" element={
                    <ProtectedRoute>
                        <Income />
                    </ProtectedRoute>
                } />
                <Route path="/expenses" element={
                    <ProtectedRoute>
                        <Expenses />
                    </ProtectedRoute>
                } />
                <Route path="/budget" element={
                    <ProtectedRoute>
                        <Budget />
                    </ProtectedRoute>
                } />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
