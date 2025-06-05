require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const resumeRoutes = require('./routes/resumeRoutes'); // Uncomment if you have resume routes

const app = express();

// Middleware to handle CORS
app.use(
    cors({
        origin: process.env.CLIENT_URL || '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['content-type', 'authorization']
    })
);

// Database connection
connectDB();

// Middleware 
app.use(express.json());


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);

// Server uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads'),
    {
        setHeaders: (res, path) => {
            res.setHeader('Access-Control-Allow-Origin', '*'); // Allow CORS for uploads
        }
    }
));

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server running at port: ${PORT}`));