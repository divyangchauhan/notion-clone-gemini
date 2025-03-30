import React, { createContext, useState, useContext, useEffect } from 'react';
import apiClient, { loginUser, registerUser, getCurrentUser } from '../services/api'; // Import API functions

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Start loading until auth check completes

    useEffect(() => {
        const checkLoggedIn = async () => {
            const token = localStorage.getItem('authToken');
            if (token) {
                console.log("Found token, attempting to verify with /api/users/me...");
                // Axios interceptor already adds the token to the header
                try {
                    const { data } = await getCurrentUser(); // Call the API
                    setUser(data); // Set user state with data from backend
                    console.log("Token verified, user set:", data);
                } catch (error) {
                    console.error('Token verification failed:', error.response ? error.response.data : error.message);
                    localStorage.removeItem('authToken'); // Remove invalid token
                    setUser(null);
                    // No need to delete axios header here, interceptor handles it per-request
                }
            } else {
                console.log("No token found.")
            }
            setLoading(false); // Auth check finished
        };

        checkLoggedIn();
    }, []);

    const login = async (email, password) => {
        setLoading(true);
        try {
            console.log("Attempting API login for:", email);
            const { data } = await loginUser({ email, password }); // Call login API
            localStorage.setItem('authToken', data.token);
            // Axios interceptor will add the token to subsequent requests
            setUser({ id: data._id, name: data.name, email: data.email }); // Use data from response
            console.log("Login successful, user set:", data);
            setLoading(false);
            return true; // Indicate success
        } catch (error) {
            console.error('Login failed:', error.response ? error.response.data : error.message);
            localStorage.removeItem('authToken');
            setUser(null);
            setLoading(false);
            // Rethrow or return specific error message if needed by UI
            return false; // Indicate failure
        }
    };

    const register = async (name, email, password) => {
         setLoading(true);
        try {
            console.log("Attempting API registration for:", name, email);
            const { data } = await registerUser({ name, email, password }); // Call register API
            localStorage.setItem('authToken', data.token);
             // Axios interceptor will add the token to subsequent requests
            setUser({ id: data._id, name: data.name, email: data.email }); // Use data from response
            console.log("Registration successful, user set:", data);
            setLoading(false);
            return true; // Indicate success
        } catch (error) {
            console.error('Registration failed:', error.response ? error.response.data : error.message);
             localStorage.removeItem('authToken');
            setUser(null);
            setLoading(false);
            // Rethrow or return specific error message if needed by UI
            return false; // Indicate failure
        }
    };

    const logout = () => {
        console.log("Logging out.");
        localStorage.removeItem('authToken');
        // No need to delete axios header, interceptor handles token presence
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
            {!loading && children} {/* Optionally render children only after loading check */}
            {/* Or keep rendering children and let ProtectedRoute handle loading state */}
             {/* {children} */}
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
