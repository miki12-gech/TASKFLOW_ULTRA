import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
dotenv.config();

const port = process.env.PORT || 3000;
const app = express();

// --- 1. MIDDLEWARE ---
// Allows us to send JSON data
app.use(express.json());

// Allows us to send Form data
app.use(express.urlencoded({ extended: true }));

// Allows cookies to be read from the request
app.use(cookieParser());

// SECURITY: Allow the Frontend to talk to the Backend
// "credentials: true" is MANDATORY for cookies to work!
app.use(cors({
origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// --- 2. ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Simple Health Check
app.get('/', (req, res) => {
  res.send('Server is ready and running TaskFlow Ultra!');
});

// --- 3. START SERVER ---
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});