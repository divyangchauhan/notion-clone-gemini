import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getDocuments, createDocument } from '../services/api'; // Import document API calls
import { Link } from 'react-router-dom'; // Import Link for document links

const DashboardPage = () => {
    const { user, logout } = useAuth();
    const [documents, setDocuments] = useState([]);
    const [loadingDocs, setLoadingDocs] = useState(true);
    const [error, setError] = useState('');
    const [newDocTitle, setNewDocTitle] = useState(''); // For creating new doc

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                setError('');
                setLoadingDocs(true);
                const { data } = await getDocuments();
                setDocuments(data);
            } catch (err) {
                console.error("Failed to fetch documents:", err.response ? err.response.data : err.message);
                setError('Failed to load documents. Please try again later.');
                // Optionally logout user if auth error (e.g., 401 Unauthorized)
                 if (err.response && err.response.status === 401) {
                    logout(); // Log out if token is invalid/expired
                 }
            } finally {
                setLoadingDocs(false);
            }
        };

        fetchDocuments();
    }, [logout]); // Add logout as dependency

    const handleCreateDocument = async (e) => {
         e.preventDefault();
         if (!newDocTitle.trim()) {
             setError('Please enter a title for the new document.');
             return;
         }
         try {
             setError('');
             const { data: newDoc } = await createDocument({ title: newDocTitle });
             setDocuments([newDoc, ...documents]); // Add new doc to the beginning of the list
             setNewDocTitle(''); // Clear input
         } catch (err) {
             console.error("Failed to create document:", err.response ? err.response.data : err.message);
             setError('Failed to create document.');
              if (err.response && err.response.status === 401) {
                 logout();
              }
         }
    };

    return (
        <div>
            <h2>Dashboard</h2>
            <p>Welcome, {user?.name || 'User'}!</p>
            <button onClick={logout} style={{ marginBottom: '20px' }}>Logout</button>

            <hr />

            <h3>Create New Document</h3>
            <form onSubmit={handleCreateDocument} style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="New document title"
                    value={newDocTitle}
                    onChange={(e) => setNewDocTitle(e.target.value)}
                    required
                />
                <button type="submit" style={{ marginLeft: '10px' }}>Create</button>
            </form>

             {error && <p style={{ color: 'red' }}>{error}</p>}

            <h3>Your Documents</h3>
            {loadingDocs ? (
                <p>Loading documents...</p>
            ) : documents.length === 0 ? (
                <p>You have no documents yet. Create one above!</p>
            ) : (
                <ul>
                    {documents.map((doc) => (
                        <li key={doc._id}>
                            {/* Link to a future document view page */}
                            <Link to={`/documents/${doc._id}`}>{doc.title}</Link>
                            {/* Add archive/delete buttons here later */}
                             <span style={{fontSize: '0.8em', marginLeft: '10px', color: 'grey'}}>
                                (Created: {new Date(doc.createdAt).toLocaleDateString()})
                                {doc.isArchived ? ' [Archived]' : ''}
                             </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default DashboardPage;
