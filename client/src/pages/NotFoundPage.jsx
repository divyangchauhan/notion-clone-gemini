import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => (
    <div>
        <h2>404 - Page Not Found</h2>
        <p>Sorry, the page you are looking for does not exist.</p>
        <Link to="/">Go to Home Page</Link>
        <br />
        <Link to="/dashboard">Go to Dashboard</Link> { /* Add link to dashboard */}
    </div>
);

export default NotFoundPage;
