import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios'; // We'll use axios later for API calls

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // To check initial auth status

    useEffect(() => {
        // Check for existing token in localStorage on initial load
        const token = localStorage.getItem('authToken');
        if (token) {
            // TODO: Verify token with backend /api/users/me endpoint
            // For now, assume token means logged in (placeholder)
            // We should fetch user data based on the token
            console.log("Found token, attempting to verify...");
            // Set user based on token validation (replace with actual user data)
             setUser({ placeholder: true }); // Placeholder
        } else {
            console.log("No token found.")
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        setLoading(true);
        try {
            // TODO: Replace with actual API call using axios
            console.log("Attempting login for:", email);
            // const response = await axios.post('/api/users/login', { email, password });
            // Simulate successful login
            const fakeResponse = { data: { _id: '123', name: 'Test User', email: email, token: 'fake-jwt-token' } };
            localStorage.setItem('authToken', fakeResponse.data.token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${fakeResponse.data.token}`; // Set auth header for subsequent requests
            setUser({ id: fakeResponse.data._id, name: fakeResponse.data.name, email: fakeResponse.data.email });
            setLoading(false);
            return true; // Indicate success
        } catch (error) {
            console.error('Login failed:', error);
            localStorage.removeItem('authToken');
            delete axios.defaults.headers.common['Authorization'];
            setUser(null);
            setLoading(false);
            return false; // Indicate failure
        }
    };

    const register = async (name, email, password) => {
         setLoading(true);
        try {
            // TODO: Replace with actual API call using axios
            console.log("Attempting registration for:", name, email);
            // const response = await axios.post('/api/users/register', { name, email, password });
             // Simulate successful registration & login
            const fakeResponse = { data: { _id: '456', name: name, email: email, token: 'fake-jwt-token-reg' } };
            localStorage.setItem('authToken', fakeResponse.data.token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${fakeResponse.data.token}`;
            setUser({ id: fakeResponse.data._id, name: fakeResponse.data.name, email: fakeResponse.data.email });
            setLoading(false);
            return true; // Indicate success
        } catch (error) {
            console.error('Registration failed:', error);
             localStorage.removeItem('authToken');
            delete axios.defaults.headers.common['Authorization'];
            setUser(null);
            setLoading(false);
            return false; // Indicate failure
        }
    };

    const logout = () => {
        console.log("Logging out.")
        localStorage.removeItem('authToken');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
    };

    // Value provided to consuming components
    const value = {
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
