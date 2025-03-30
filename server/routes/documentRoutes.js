const express = require('express');
const router = express.Router();
const {
    getDocuments,
    createDocument,
    getDocumentById,
    updateDocument,
    archiveDocument,
    restoreDocument,
    deleteDocument,
    getArchivedDocuments,
} = require('../controllers/documentController');
const { protect } = require('../middleware/authMiddleware');

// Apply protect middleware to all routes in this file
router.use(protect);

// --- Routes for specific document actions ---

// Get archived documents (needs to be before /:id)
router.get('/archived', getArchivedDocuments);

// Archive a document
router.patch('/:id/archive', archiveDocument);

// Restore a document
router.patch('/:id/restore', restoreDocument);

// --- Standard CRUD routes ---

// Get all top-level documents OR Create a new document
router.route('/')
    .get(getDocuments)
    .post(createDocument);

// Get, Update, or Delete a specific document by ID
router.route('/:id')
    .get(getDocumentById)
    .put(updateDocument)
    .delete(deleteDocument);

module.exports = router;
