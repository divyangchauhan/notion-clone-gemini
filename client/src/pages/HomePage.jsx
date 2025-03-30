import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { isAuthenticated, logout, user } = useAuth();
  return (
    <div>
      <h1>Welcome to Notion Clone</h1>
      <p>This is the public home page.</p>
      {isAuthenticated ? (
        <div>
          <p>You are logged in as {user?.name}.</p>
          <Link to="/dashboard" style={{ marginRight: '10px' }}>Go to Dashboard</Link>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <div>
            <p>Please log in or register to continue.</p>
            <Link to="/login" style={{ marginRight: '10px' }}>Login</Link>
            <Link to="/register">Register</Link>
        </div>
      )}
    </div>
  );
};

export default HomePage;
