require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/db'); // Import connectDB function

// Connect to Database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: false })); // for parsing application/x-www-form-urlencoded

// Basic Route
app.get('/', (req, res) => {
  res.send('Notion Clone API Running!');
});

// Mount Routes
app.use('/api/users', require('./routes/userRoutes'));

// TODO: Add routes for documents

// TODO: Add Error Handling Middleware

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
