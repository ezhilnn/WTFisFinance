import { Request, Response, NextFunction } from 'express';
import { admin } from '../config/firebase';
import { ADMIN_EMAIL } from '../config/constants';
import { unauthorized } from '../utils/response.util';

// Extend Express Request to include user info
export interface AuthRequest extends Request {
  user?: {
    email: string;
    uid: string;
    name?: string;
  };
}

// Middleware to verify Firebase ID token (any authenticated user)
export const verifyUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      unauthorized(res, 'No token provided');
      return;
    }

    const idToken = authHeader.split('Bearer ')[1];

    // Verify the Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    // Attach user info to request
    req.user = {
      email: decodedToken.email!,
      uid: decodedToken.uid,
      name: decodedToken.name,
    };

    next();
  } catch (error) {
    console.error('Auth error:', error);
    unauthorized(res, 'Invalid or expired token');
  }
};

// Middleware to verify Firebase ID token and check admin status
export const verifyAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      unauthorized(res, 'No token provided');
      return;
    }

    const idToken = authHeader.split('Bearer ')[1];

    // Verify the Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    // Check if user is admin
    if (decodedToken.email !== ADMIN_EMAIL) {
      unauthorized(res, 'Admin access required');
      return;
    }

    // Attach user info to request
    req.user = {
      email: decodedToken.email!,
      uid: decodedToken.uid,
      name: decodedToken.name,
    };

    next();
  } catch (error) {
    console.error('Auth error:', error);
    unauthorized(res, 'Invalid or expired token');
  }
};