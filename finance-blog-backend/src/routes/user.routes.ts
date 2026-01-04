import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { verifyAdmin, verifyUser } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.get('/:uid', userController.getUserByUid);

// Authenticated routes (any logged-in user)
// Called after successful login (email/password OR OAuth)
router.post('/sync', verifyUser, userController.syncUser);
router.get('/me', verifyUser, userController.getCurrentUser);

// Admin routes
router.get('/', verifyAdmin, userController.getAllUsers);

export default router;