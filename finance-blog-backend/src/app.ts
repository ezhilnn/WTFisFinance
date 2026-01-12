import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import routes
import blogRoutes from './routes/blog.routes';
import commentRoutes from './routes/comment.routes';
import likeRoutes from './routes/like.routes';
import viewRoutes from './routes/view.routes';
import tagRoutes from './routes/tag.routes';
import adminRoutes from './routes/admin.routes';
import userRoutes from './routes/user.routes';
import learnViewRoutes from './routes/learn.view.routes'; // NEW


// Import middleware
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { LEGAL_DISCLAIMER } from './config/constants';

// Load environment variables
dotenv.config();

// Create Express app
const app: Application = express();

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
};

// Middleware
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // ← REQUIRED
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    disclaimer: LEGAL_DISCLAIMER,
  });
});

// API routes
app.use('/api/blogs', blogRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/views', viewRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/learn', learnViewRoutes); 

// Error handling (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

export default app;