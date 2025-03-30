import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getDocumentById, updateDocument } from '../services/api'; // Import API calls
import { useAuth } from '../context/AuthContext';

// Placeholder for a richer text editor later
const BasicEditor = ({ value, onChange }) => (
    <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={10}
        style={{ width: '100%', marginTop: '10px' }}
        placeholder="Start writing your document content here..."
    />
);

const DocumentPage = () => {
    const { id } = useParams(); // Get document ID from URL
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [document, setDocument] = useState(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDocument = async () => {
            try {
                setError('');
                setLoading(true);
                const { data } = await getDocumentById(id);
                setDocument(data);
                setTitle(data.title);
                setContent(data.content || ''); // Handle null/undefined content
            } catch (err) {
                console.error("Failed to fetch document:", err.response ? err.response.data : err.message);
                setError(`Failed to load document (ID: ${id}). It might not exist or you don\'t have permission.`);
                if (err.response && err.response.status === 401) {
                    logout();
                } else if (err.response && err.response.status === 404) {
                    // Handle not found specifically - maybe navigate back or show message
                    setError('Document not found.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchDocument();
    }, [id, logout]);

    const handleSave = async () => {
        try {
            setError('');
            setSaving(true);
            await updateDocument(id, { title, content });
            // Optionally update the local state if the backend returns the updated doc
            // setDocument({ ...document, title, content });
             alert('Document saved successfully!'); // Simple feedback
        } catch (err) {
             console.error("Failed to save document:", err.response ? err.response.data : err.message);
             setError('Failed to save document.');
             if (err.response && err.response.status === 401) {
                 logout();
             }
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div>Loading document...</div>;
    }

    if (error) {
        return (
            <div>
                <p style={{ color: 'red' }}>{error}</p>
                <Link to="/dashboard">Back to Dashboard</Link>
            </div>
        );
    }

    if (!document) {
        // Should generally be covered by error state, but as a fallback
        return <div>Document not found.</div>;
    }

    return (
        <div>
            <Link to="/dashboard" style={{ marginRight: '20px' }}>&larr; Back to Dashboard</Link>
            <button onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save Document'}
            </button>
            <hr style={{ margin: '15px 0' }}/>

            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ fontSize: '1.5em', marginBottom: '10px', width: 'calc(100% - 16px)' }}
                placeholder="Document Title"
            />

            <BasicEditor value={content} onChange={setContent} />

            {/* Add archive/delete options here later */}
            {document.isArchived && <p style={{color: 'orange', marginTop: '10px'}}>[This document is archived]</p>}
        </div>
    );
};

export default DocumentPage;
