import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import * as userModel from '../models/user.model'
import { sendSuccess, sendError, notFound } from '../utils/response.util';

// Create or update user after login (email/password OR OAuth)
// This is called from frontend after successful authentication
export const syncUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // User info comes from verified Firebase token (in middleware)
    const { uid, email } = req.user!;
    
    const user = await userModel.createOrUpdateUser({ uid, email });
    
    sendSuccess(res, user, 'User synced successfully');
  } catch (error: any) {
    console.error('Sync user error:', error);
    
    // Handle duplicate email error
    if (error.message.includes('already registered')) {
      sendError(res, error.message, 409); // 409 Conflict
      return;
    }
    
    sendError(res, 'Failed to sync user');
  }
};

// Get current user profile (authenticated)
export const getCurrentUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await userModel.getUserByUid(req.user!.uid);
    
    if (!user) {
      notFound(res, 'User profile');
      return;
    }
    
    sendSuccess(res, user);
  } catch (error) {
    console.error('Get current user error:', error);
    sendError(res, 'Failed to fetch user profile');
  }
};

// Get user by UID (public - for displaying comment authors)
export const getUserByUid = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { uid } = req.params;
    const user = await userModel.getUserByUid(uid);
    
    if (!user) {
      notFound(res, 'User');
      return;
    }
    
    // Return public info only
    const publicInfo = {
      uid: user.uid,
      email: user.email,
      role: user.role,
    };
    
    sendSuccess(res, publicInfo);
  } catch (error) {
    console.error('Get user by UID error:', error);
    sendError(res, 'Failed to fetch user');
  }
};

// Get all users (admin only)
export const getAllUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const users = await userModel.getAllUsers();
    sendSuccess(res, users);
  } catch (error) {
    console.error('Get all users error:', error);
    sendError(res, 'Failed to fetch users');
  }
};