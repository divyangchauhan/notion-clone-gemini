import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const { login, isAuthenticated, loading } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState(''); // To display login errors

    const { email, password } = formData;

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors
        if (!email || !password) {
             setError('Please enter both email and password.');
             return;
        }
        const success = await login(email, password); // Use state values
        if (success) {
            navigate('/dashboard'); // Redirect on success
        } else {
            // Error message can be more specific based on API response if needed
            setError('Login Failed. Please check your credentials.');
        }
    };

    // If user is already authenticated, redirect to dashboard
    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div>
            <h2>Login Page</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={onSubmit}>
                <div>
                    <label htmlFor="email">Email:</label><br/>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        name="email"
                        value={email}
                        onChange={onChange}
                        required
                        autoComplete="email"
                    />
                </div>
                <div style={{ marginTop: '10px' }}>
                    <label htmlFor="password">Password:</label><br/>
                    <input
                        type="password"
                        placeholder="Enter your password"
                        name="password"
                        value={password}
                        onChange={onChange}
                        required
                        minLength="6" // Optional: Add basic client-side validation
                        autoComplete="current-password"
                    />
                </div>
                <button type="submit" disabled={loading} style={{ marginTop: '15px' }}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
            <p style={{ marginTop: '20px' }}>
                Don't have an account? <Link to="/register">Register here</Link>
            </p>
        </div>
    );
};

export default LoginPage;
