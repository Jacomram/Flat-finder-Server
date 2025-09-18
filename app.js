const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static('public'));

// Import routes
const userRoutes = require('./Routes/userRoutes');
const flatRoutes = require('./Routes/flatRoutes');
const messageRoutes = require('./Routes/messageRoutes');

// Use routes
app.use('/users', userRoutes);
app.use('/flats', flatRoutes);

// Message routes are nested under flats
app.use('/flats', messageRoutes);

// Serve index.html for root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/flat-finder')
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Basic error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
