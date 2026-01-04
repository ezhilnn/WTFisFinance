import { Router } from 'express';
import * as adminController from '../controllers/admin.controller';
import { verifyAdmin } from '../middleware/auth.middleware';

const router = Router();

// Admin verification endpoint (protected)
router.get('/verify', verifyAdmin, adminController.verifyAdmin);

// Get admin info (public - just shows which email is admin)
router.get('/info', adminController.getAdminInfo);

export default router;