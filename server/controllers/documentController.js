const Document = require('../models/Document');

// Utility function to check ownership
const checkOwnership = (doc, userId) => {
    if (!doc) {
        return { authorized: false, status: 404, message: 'Document not found' };
    }
    if (doc.user.toString() !== userId.toString()) {
        return { authorized: false, status: 403, message: 'User not authorized for this document' };
    }
    return { authorized: true };
};

// @desc    Get documents for the logged in user
// @route   GET /api/documents
// @access  Private
const getDocuments = async (req, res) => {
    try {
        // Fetch only top-level, non-archived documents for the user
        // We can add filtering by parentDocument later via query params
        const documents = await Document.find({ user: req.user.id, isArchived: false, parentDocument: null })
                                     .sort({ createdAt: 'desc' }); // Sort by creation date
        res.status(200).json(documents);
    } catch (error) {
        console.error('Error fetching documents:', error);
        res.status(500).json({ message: 'Server error fetching documents' });
    }
};

// @desc    Create a new document
// @route   POST /api/documents
// @access  Private
const createDocument = async (req, res) => {
    const { title, parentDocument } = req.body;

    try {
        // Optional: Validate parentDocument if provided (ensure it exists and belongs to user)
        if (parentDocument) {
            const parent = await Document.findById(parentDocument);
            const ownershipCheck = checkOwnership(parent, req.user.id);
            if (!ownershipCheck.authorized) {
                return res.status(ownershipCheck.status).json({ message: ownershipCheck.message });
            }
        }

        const document = await Document.create({
            title: title || 'Untitled', // Use provided title or default
            user: req.user.id,
            parentDocument: parentDocument || null,
            // Default values for content, icon, coverImage etc. are handled by the schema
        });
        res.status(201).json(document);
    } catch (error) {
        console.error('Error creating document:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Validation Error', errors: error.errors });
        }
        res.status(500).json({ message: 'Server error creating document' });
    }
};

// @desc    Get a specific document by ID
// @route   GET /api/documents/:id
// @access  Private
const getDocumentById = async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);

        const ownershipCheck = checkOwnership(document, req.user.id);
        if (!ownershipCheck.authorized) {
            return res.status(ownershipCheck.status).json({ message: ownershipCheck.message });
        }

        res.status(200).json(document);
    } catch (error) {
        console.error(`Error fetching document ${req.params.id}:`, error);
        if (error.kind === 'ObjectId') {
             return res.status(404).json({ message: 'Document not found (invalid ID format)' });
        }
        res.status(500).json({ message: 'Server error fetching document' });
    }
};

// @desc    Update a document
// @route   PUT /api/documents/:id
// @access  Private
const updateDocument = async (req, res) => {
    const { title, content, icon, coverImage, isPublished, parentDocument /* Potentially disallow parent change here? */ } = req.body;

    try {
        const document = await Document.findById(req.params.id);

        const ownershipCheck = checkOwnership(document, req.user.id);
        if (!ownershipCheck.authorized) {
            return res.status(ownershipCheck.status).json({ message: ownershipCheck.message });
        }

        // Prevent updating archived documents directly? Maybe require unarchive first.
        if (document.isArchived) {
            return res.status(400).json({ message: 'Cannot update an archived document' });
        }

        // Update fields if they are provided in the request body
        if (title !== undefined) document.title = title;
        if (content !== undefined) document.content = content;
        if (icon !== undefined) document.icon = icon;
        if (coverImage !== undefined) document.coverImage = coverImage;
        if (isPublished !== undefined) document.isPublished = isPublished;
        // Add validation if allowing parentDocument changes
        // if (parentDocument !== undefined) document.parentDocument = parentDocument;

        const updatedDocument = await document.save();
        res.status(200).json(updatedDocument);
    } catch (error) {
        console.error(`Error updating document ${req.params.id}:`, error);
        if (error.kind === 'ObjectId') {
             return res.status(404).json({ message: 'Document not found (invalid ID format)' });
        }
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Validation Error', errors: error.errors });
        }
        res.status(500).json({ message: 'Server error updating document' });
    }
};

// @desc    Archive a document (soft delete)
// @route   PATCH /api/documents/:id/archive
// @access  Private
const archiveDocument = async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);

        const ownershipCheck = checkOwnership(document, req.user.id);
        if (!ownershipCheck.authorized) {
            return res.status(ownershipCheck.status).json({ message: ownershipCheck.message });
        }

        if (document.isArchived) {
             return res.status(400).json({ message: 'Document already archived' });
        }

        document.isArchived = true;
        // TODO: Consider recursively archiving child documents? Maybe later.
        // await Document.updateMany({ user: req.user.id, parentDocument: document._id }, { $set: { isArchived: true } });

        await document.save();
        // Sending back minimal response or the archived doc? Let's send minimal.
        res.status(200).json({ message: 'Document archived successfully', id: document._id });

    } catch (error) {
         console.error(`Error archiving document ${req.params.id}:`, error);
        if (error.kind === 'ObjectId') {
             return res.status(404).json({ message: 'Document not found (invalid ID format)' });
        }
        res.status(500).json({ message: 'Server error archiving document' });
    }
};

// @desc    Restore an archived document
// @route   PATCH /api/documents/:id/restore
// @access  Private
const restoreDocument = async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);

        const ownershipCheck = checkOwnership(document, req.user.id);
        if (!ownershipCheck.authorized) {
            return res.status(ownershipCheck.status).json({ message: ownershipCheck.message });
        }

        if (!document.isArchived) {
             return res.status(400).json({ message: 'Document is not archived' });
        }

        document.isArchived = false;
        // TODO: Consider recursively restoring parent/child documents? Maybe later.
        // Check if parent is archived, if so, maybe restore parent or move to root?
        // Restore direct children?

        await document.save();
        res.status(200).json(document); // Send back the restored document

    } catch (error) {
         console.error(`Error restoring document ${req.params.id}:`, error);
        if (error.kind === 'ObjectId') {
             return res.status(404).json({ message: 'Document not found (invalid ID format)' });
        }
        res.status(500).json({ message: 'Server error restoring document' });
    }
};


// @desc    Permanently delete a document
// @route   DELETE /api/documents/:id
// @access  Private
const deleteDocument = async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);

        const ownershipCheck = checkOwnership(document, req.user.id);
        if (!ownershipCheck.authorized) {
            return res.status(ownershipCheck.status).json({ message: ownershipCheck.message });
        }

        // Optional: Only allow deletion of archived documents?
        // if (!document.isArchived) {
        //     return res.status(400).json({ message: 'Document must be archived before deletion' });
        // }

        // TODO: Handle deletion of child documents recursively? Very important!
        // This is complex, maybe defer full implementation.
        // For now, just delete the single document.

        await Document.deleteOne({ _id: req.params.id });

        res.status(200).json({ message: 'Document permanently deleted', id: req.params.id });

    } catch (error) {
        console.error(`Error deleting document ${req.params.id}:`, error);
        if (error.kind === 'ObjectId') {
             return res.status(404).json({ message: 'Document not found (invalid ID format)' });
        }
        res.status(500).json({ message: 'Server error deleting document' });
    }
};

// Function to get archived documents
// @desc    Get archived documents for the logged in user
// @route   GET /api/documents/archived
// @access  Private
const getArchivedDocuments = async (req, res) => {
    try {
        const documents = await Document.find({ user: req.user.id, isArchived: true })
                                     .sort({ updatedAt: 'desc' }); // Sort by when they were archived (updatedAt)
        res.status(200).json(documents);
    } catch (error) {
        console.error('Error fetching archived documents:', error);
        res.status(500).json({ message: 'Server error fetching archived documents' });
    }
};


module.exports = {
    getDocuments,
    createDocument,
    getDocumentById,
    updateDocument,
    archiveDocument,
    restoreDocument,
    deleteDocument,
    getArchivedDocuments,
};
