/**
 * Authentication Middleware
 * JWT token verification
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

/**
 * Verify JWT token middleware
 */
export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({ error: 'Access token required' });
      return;
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        res.status(403).json({ error: 'Invalid or expired token' });
        return;
      }

      req.user = decoded as { id: number; email: string; role: string };
      next();
    });
  } catch (error) {
    res.status(500).json({ error: 'Authentication failed' });
  }
};

/**
 * Check if user has admin role
 */
export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ error: 'Admin access required' });
    return;
  }
  next();
};

/**
 * Check if user has manager or admin role
 */
export const requireManager = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user || !['admin', 'manager'].includes(req.user.role)) {
    res.status(403).json({ error: 'Manager access required' });
    return;
  }
  next();
};
