import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as apiLogin } from '../services/api';
import ForgotPassword from './forgotPassword';

const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false); const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username.trim() || !password.trim()) {
            alert('Please enter both username and password');
            return;
        }

        setLoading(true);

        try {
            console.log('Login attempt:', { username, password, remember });
            const response = await apiLogin(username, password);

            console.log('Full API response:', response);
            console.log('User object:', response.user);
            if (response.accessToken || response.token || response.jwt) {
                const token = response.accessToken || response.token || response.jwt;
                const user = response.user;
                const role = user?.role || response.role || response.authorities || 'USER';
                localStorage.setItem('authToken', token);
                localStorage.setItem('userRole', role);
                localStorage.setItem('username', username);
                localStorage.setItem('userInfo', JSON.stringify(user));

                alert(`Login successful! Welcome ${role === 'ADMIN' ? 'Administrator' : 'HR Manager'}`);
                setTimeout(() => {
                    if (role === 'ADMIN') {
                        navigate('/admin');
                    } else if (role === 'HR') {
                        navigate('/hr-dashboard');
                    } else {
                        navigate('/');
                    }
                }, 1000);

                console.log('User logged in:', response);

            } else {
                console.error('Unexpected response structure:', response);
                alert(`Login failed: Invalid response from server. Check console for details.`);
            }
        } catch (error) {
            console.error('Login failed:', error);
            console.error('Error response:', error.response);

            if (error.response?.status === 401) {
                alert('Login failed: Invalid username or password');
            } else if (error.response?.status === 403) {
                alert('Login failed: Access forbidden');
            } else if (error.response?.status >= 500) {
                alert('Login failed: Server error. Please try again later.');
            } else if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
                alert('Login failed: Cannot connect to server. Make sure your backend is running on http://localhost:8080');
            } else {
                alert(`Login failed: ${error.message || 'Please check your connection and try again.'}`);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSubmit(e);
        }
    };

    const handleButtonClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Button clicked!');
        handleSubmit(e);
    };

    return (
        <div>
            {showForgotPassword ? (
                <ForgotPassword onBack={() => setShowForgotPassword(false)} />
            ) : (
                <div className="min-h-screen bg-gradient-to-br from-teal-400 via-teal-500 to-emerald-500 flex items-center justify-center p-4 relative overflow-hidden">
                    {/* Background Stars */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute top-12 left-8 w-1 h-1 bg-white rounded-full opacity-80"></div>
                        <div className="absolute top-20 left-16 w-0.5 h-0.5 bg-white rounded-full opacity-60"></div>
                        <div className="absolute top-32 right-20 w-1 h-1 bg-white rounded-full opacity-80"></div>
                        <div className="absolute top-40 right-8 w-0.5 h-0.5 bg-white rounded-full opacity-60"></div>
                        <div className="absolute bottom-32 left-12 w-1 h-1 bg-white rounded-full opacity-80"></div>
                        <div className="absolute bottom-20 right-16 w-0.5 h-0.5 bg-white rounded-full opacity-60"></div>
                    </div>

                    {/* Main Card */}
                    <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
                        {/* Header Section with Landscape */}
                        <div className="bg-gradient-to-b from-teal-600 to-teal-700 px-8 py-12 text-center text-white relative overflow-hidden">
                            <h1 className="text-2xl font-light mb-3">Welcome to the Applications Management System</h1>
                            <p className="text-sm opacity-90 mb-8 leading-relaxed">
                                Good Morning! Please login to access your dashboard
                            </p>

                            {/* Simple Landscape Illustration */}
                            <div className="relative h-32 -mx-8 -mb-12">
                                {/* Sun */}
                                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-emerald-300 to-emerald-400 rounded-full opacity-80"></div>

                                {/* Mountains */}
                                <div className="absolute bottom-0 left-0 right-0">
                                    <div className="absolute bottom-0 left-0 right-0 h-16">
                                        <div
                                            className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-emerald-400 to-emerald-300 opacity-60"
                                            style={{ clipPath: "polygon(0% 100%, 20% 60%, 40% 80%, 60% 40%, 80% 70%, 100% 50%, 100% 100%)" }}
                                        ></div>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 h-20">
                                        <div
                                            className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-emerald-500 to-emerald-400 opacity-80"
                                            style={{ clipPath: "polygon(0% 100%, 15% 70%, 35% 50%, 55% 80%, 75% 45%, 90% 65%, 100% 55%, 100% 100%)" }}
                                        ></div>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 h-24">
                                        <div
                                            className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-emerald-600 to-emerald-500"
                                            style={{ clipPath: "polygon(0% 100%, 25% 50%, 45% 70%, 65% 30%, 85% 60%, 100% 40%, 100% 100%)" }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Trees */}
                                <div className="absolute bottom-2 left-8">
                                    <div className="w-1 h-6 bg-emerald-800 relative">
                                        <div
                                            className="absolute -top-4 -left-2 w-5 h-8 bg-emerald-700"
                                            style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
                                        ></div>
                                    </div>
                                </div>
                                <div className="absolute bottom-1 right-12">
                                    <div className="w-1 h-8 bg-emerald-800 relative">
                                        <div
                                            className="absolute -top-5 -left-2.5 w-6 h-10 bg-emerald-700"
                                            style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Login Form Section */}
                        <div className="px-8 py-8">
                            <h2 className="text-center text-gray-600 text-lg font-medium mb-6">USER LOGIN</h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Username Input */}
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white z-10">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        className="nature-input w-full focus:outline-none"
                                        disabled={loading}
                                    />
                                </div>

                                {/* Password Input */}
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white z-10">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        className="nature-input w-full focus:outline-none"
                                        disabled={loading}
                                    />
                                </div>

                                {/* Remember & Forgot Password */}
                                <div className="flex items-center justify-between text-sm text-gray-600 pt-2">
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="remember"
                                            checked={remember}
                                            onChange={(e) => setRemember(e.target.checked)}
                                            className="border-gray-400"
                                            disabled={loading}
                                        />
                                        <label htmlFor="remember" className="cursor-pointer">
                                            Remember
                                        </label>
                                    </div>
                                    <div
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            console.log('Forgot password clicked!');
                                            if (!loading) {
                                                setShowForgotPassword(true);
                                            }
                                        }}
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            console.log('Forgot password mouse down!');
                                        }}
                                        className={`text-gray-500 hover:text-gray-700 transition-colors cursor-pointer ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        style={{
                                            pointerEvents: 'auto',
                                            zIndex: 30,
                                            position: 'relative',
                                            userSelect: 'none'
                                        }}
                                    >
                                        Forgot Password?
                                    </div>
                                </div>

                                {/* Login Button */}
                                <div className="pt-4">
                                    <button
                                        type="button"
                                        onClick={handleButtonClick}
                                        onMouseDown={(e) => console.log('Mouse down on button')}
                                        onMouseUp={(e) => console.log('Mouse up on button')}
                                        disabled={loading}
                                        style={{
                                            pointerEvents: 'auto',
                                            zIndex: 10,
                                            position: 'relative'
                                        }}
                                        className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center cursor-pointer"
                                    >
                                        {loading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Signing In...
                                            </>
                                        ) : (
                                            'Login'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white text-sm opacity-80">
                        🤍
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;