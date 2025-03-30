import axios from 'axios';

// Create an axios instance
const apiClient = axios.create({
    baseURL: '/api', // Proxy will handle directing this to the backend server (setup needed in vite.config.js)
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the token in headers
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// --- User API Calls ---
export const loginUser = (credentials) => apiClient.post('/users/login', credentials);
export const registerUser = (userData) => apiClient.post('/users/register', userData);
// Add a function to get current user info (useful for verifying token)
export const getCurrentUser = () => apiClient.get('/users/me'); // Assuming you have a /api/users/me endpoint

// --- Document API Calls ---
export const getDocuments = () => apiClient.get('/documents');
export const createDocument = (documentData) => apiClient.post('/documents', documentData);
export const getDocumentById = (id) => apiClient.get(`/documents/${id}`);
export const updateDocument = (id, documentData) => apiClient.put(`/documents/${id}`, documentData);
export const archiveDocument = (id) => apiClient.patch(`/documents/${id}/archive`);
export const restoreDocument = (id) => apiClient.patch(`/documents/${id}/restore`);
export const deleteDocument = (id) => apiClient.delete(`/documents/${id}`);

export default apiClient;
