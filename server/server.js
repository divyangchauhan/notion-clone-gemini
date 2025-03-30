require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/db'); // Import connectDB function

// Connect to Database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Basic Route
app.get('/', (req, res) => {
  res.send('Notion Clone API Running!');
});

// TODO: Add API routes (e.g., users, documents)

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
