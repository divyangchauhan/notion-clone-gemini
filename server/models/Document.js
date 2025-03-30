const mongoose = require('mongoose');

const documentSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      default: 'Untitled',
    },
    content: {
      type: String, // Store content as JSON string (e.g., from a block editor) or Markdown
      // Consider limitations on string size if storing very large documents directly.
      // Alternatively, could store content blocks in a separate collection.
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Reference to the User model
    },
    parentDocument: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document', // Self-reference for hierarchy
      default: null,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String, // URL or emoji character
      default: null,
    },
    coverImage: {
      type: String, // URL to the cover image
      default: null,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    // We can add more fields like collaborators, permissions etc. later
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

// Optional: Add an index on user and parentDocument for faster querying
documentSchema.index({ user: 1, parentDocument: 1 });

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;
