import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css'

// Import Page Components
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import DocumentPage from './pages/DocumentPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  const { loading, isAuthenticated } = useAuth(); // Also get isAuthenticated for nav

  // Display a loading indicator while the initial auth check is running
  if (loading) {
      return <div>Loading Application...</div>;
  }

  return (
    <div className="App">
      {/* Basic Nav - Update based on auth state */}
      <nav style={{ marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid #ccc'}}>
        <Link to="/" style={{ marginRight: '10px' }}>Home</Link>
        {isAuthenticated && (
           <Link to="/dashboard" style={{ marginRight: '10px' }}>Dashboard</Link>
        )}
        {!isAuthenticated && (
            <>
                <Link to="/login" style={{ marginRight: '10px' }}>Login</Link>
                <Link to="/register">Register</Link>
            </>
        )}
        {/* Logout button could also go here or in a user menu */}
      </nav>

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes - Using ProtectedRoute component */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/documents/:id" element={<DocumentPage />} />
          {/* Add other protected routes here */}
        </Route>

        {/* Catch-all Not Found Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  )
}

export default App
