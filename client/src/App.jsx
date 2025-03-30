import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom'; 
import { useAuth } from './context/AuthContext'; 
import ProtectedRoute from './components/ProtectedRoute'; 
import './App.css'

// --- Placeholder Pages/Components ---
// In a real app, these would be in separate files in pages/ or components/
const HomePage = () => {
  const { isAuthenticated, logout } = useAuth();
  return (
    <div>
      <h1>Home Page (Public)</h1>
      {isAuthenticated ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <><Link to="/login">Login</Link> or <Link to="/register">Register</Link></>
      )}
    </div>
  );
};

const LoginPage = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate(); 

  // Placeholder Login Form Logic
  const handleLogin = async (e) => {
    e.preventDefault();
    // TODO: Get email/password from form state
    const success = await login('test@example.com', 'password'); 
    if (success) {
      navigate('/dashboard'); 
    }
  };

   if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />; 
  }

  return (
    <div>
      <h2>Login Page</h2>
      <form onSubmit={handleLogin}>
        {/* Basic form fields - add proper inputs later */}
        <input type="email" placeholder="Email (test@example.com)" disabled/><br/>
        <input type="password" placeholder="Password (password)" disabled/><br/>
        <button type="submit">Login (Simulated)</button>
      </form>
      <p>Don't have an account? <Link to="/register">Register here</Link></p>
    </div>
  );
};

const RegisterPage = () => {
   const { register, isAuthenticated } = useAuth();
   const navigate = useNavigate();

  // Placeholder Register Form Logic
  const handleRegister = async (e) => {
    e.preventDefault();
    // TODO: Get name/email/password from form state
    const success = await register('New User', 'new@example.com', 'password'); 
    if (success) {
      navigate('/dashboard'); 
    }
  };

   if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />; 
  }

  return (
    <div>
      <h2>Register Page</h2>
       <form onSubmit={handleRegister}>
        {/* Basic form fields - add proper inputs later */}
        <input type="text" placeholder="Name (New User)" disabled/><br/>
        <input type="email" placeholder="Email (new@example.com)" disabled/><br/>
        <input type="password" placeholder="Password (password)" disabled/><br/>
        <button type="submit">Register (Simulated)</button>
      </form>
      <p>Already have an account? <Link to="/login">Login here</Link></p>
    </div>
  );
};

const DashboardPage = () => {
  const { user, logout } = useAuth();
  return (
    <div>
      <h2>Dashboard (Protected)</h2>
      <p>Welcome, {user?.name || 'User'}!</p>
      {/* We will list documents here later */}
      <button onClick={logout}>Logout</button>
    </div>
  );
};

const DocumentPage = () => <div>Single Document Page (Protected)</div>; 
const NotFoundPage = () => <div>404 Not Found</div>;
// --- End Placeholder Pages/Components ---

function App() {
  const { loading } = useAuth();

  if (loading) {
      return <div>Loading Application...</div>; 
  }

  return (
    <div className="App">
      {/* Basic Nav - Consider moving to a Layout component */}
      <nav style={{ marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid #ccc'}}>
        <Link to="/">Home</Link> | 
        <Link to="/dashboard">Dashboard</Link>
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
