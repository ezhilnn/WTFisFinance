import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { sendSuccess } from '../utils/response.util';
import { ADMIN_EMAIL } from '../config/constants';

// Verify admin status (called after successful OAuth login on frontend)
export const verifyAdmin = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // The verifyAdmin middleware already checked the token and admin status
    // This endpoint just confirms the user is authenticated as admin
    sendSuccess(res, {
      isAdmin: true,
      email: req.user!.email,
      name: req.user!.name,
    }, 'Admin verified');
    console.log("admin logged in");
  } catch (error) {
    console.error('Verify admin error:', error);
    sendSuccess(res, { isAdmin: false }, 'Not an admin');
  }
};

// Get admin info
export const getAdminInfo = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    sendSuccess(res, {
      email: ADMIN_EMAIL,
      message: 'Only this email can access admin features',
    });
  } catch (error) {
    console.error('Get admin info error:', error);
    sendSuccess(res, { email: ADMIN_EMAIL });
  }
};