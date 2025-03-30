import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
    const { register, isAuthenticated, loading } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '' // Added for password confirmation
    });
    const [error, setError] = useState('');

    const { name, email, password, confirmPassword } = formData;

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (!name || !email || !password) {
             setError('Please fill in all fields.');
             return;
        }
        try {
            const success = await register(name, email, password);
            if (success) {
                navigate('/dashboard');
            } else {
                 // AuthContext might not return specific errors, set a generic one
                setError('Registration failed. Please try again.');
            }
        } catch (err) {
             // This catch block might be redundant if AuthContext handles errors
             console.error("Registration onSubmit error:", err);
             setError('An unexpected error occurred during registration.');
        }
    };

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div>
            <h2>Register Page</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={onSubmit}>
                 <div>
                    <label htmlFor="name">Name:</label><br/>
                    <input
                        type="text"
                        placeholder="Enter your name"
                        name="name"
                        value={name}
                        onChange={onChange}
                        required
                    />
                </div>
                 <div style={{ marginTop: '10px' }}>
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
                        placeholder="Enter your password (min 6 chars)"
                        name="password"
                        value={password}
                        onChange={onChange}
                        required
                        minLength="6"
                        autoComplete="new-password"
                    />
                </div>
                 <div style={{ marginTop: '10px' }}>
                    <label htmlFor="confirmPassword">Confirm Password:</label><br/>
                    <input
                        type="password"
                        placeholder="Confirm your password"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={onChange}
                        required
                        minLength="6"
                        autoComplete="new-password"
                    />
                </div>
                <button type="submit" disabled={loading} style={{ marginTop: '15px' }}>
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>
            <p style={{ marginTop: '20px' }}>
                Already have an account? <Link to="/login">Login here</Link>
            </p>
        </div>
    );
};

export default RegisterPage;
