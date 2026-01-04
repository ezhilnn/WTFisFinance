import { Router } from 'express';
import * as viewController from '../controllers/view.controller';

const router = Router();

// Public routes (no auth required)
router.post('/view', viewController.recordView);
router.post('/engaged', viewController.recordEngagedRead);

export default router;