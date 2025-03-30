import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        // Optional: Show a loading spinner while checking auth status
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        // Redirect them to the /login page, but save the current location they were
        // trying to go to. This allows us to send them along to that page after login.
        // Note: You might want to pass the location state differently depending on your login flow.
        return <Navigate to="/login" replace />;
    }

    return <Outlet />; // Render the child route component if authenticated
};

export default ProtectedRoute;
