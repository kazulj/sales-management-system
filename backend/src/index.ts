/**
 * Main Server File
 * Express server with all routes and middleware
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';
import { initializeDatabase } from './config/database';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/auth';
import customersRoutes from './routes/customers';
import productsRoutes from './routes/products';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }));
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize database
try {
  initializeDatabase();
} catch (error) {
  console.error('Failed to initialize database:', error);
  process.exit(1);
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/customers', customersRoutes);
app.use('/api/products', productsRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
  🚀 Sales Management API Server
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ✅ Server running on port ${PORT}
  ✅ Environment: ${process.env.NODE_ENV || 'development'}
  ✅ CORS Origin: ${process.env.CORS_ORIGIN || 'http://localhost:5173'}
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `);
});

export default app;
