const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { sendEmail } = require('./services/EmailService');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Trust Railway's reverse proxy
app.set('trust proxy', 1);

// Force backend to listen on 5001 during development to avoid local port conflicts
const PORT = process.env.PORT || 5001;


// Middleware
app.use(helmet()); // Security headers

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

app.use(cors({
  origin: ['https://blog-app-frontend-mocha-delta.vercel.app', 'http://localhost:5173'],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Database connection
const connectDB = require('./config/db');

connectDB();



// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);



// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Blog App Backend API is running!' });
});

// Add this after your routes
app.get('/api/test-email', async (req, res) => {
  const result = await sendEmail({
    to: 'asjadnawaz2002@gmail.com',
    subject: 'Test email',
    html: '<p>This is a test email from your app.</p>',
  });
  res.json(result);
  res.end("Done")
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;