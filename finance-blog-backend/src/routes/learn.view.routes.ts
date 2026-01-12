// src/routes/learn.view.routes.ts

import { Router } from 'express';
import * as learnViewController from '../controllers/learn.view.controller';

const router = Router();

// Record view (public)
router.post('/view', learnViewController.recordView);

// Analytics endpoints (could be admin-only if needed)
router.get('/analytics/product/:productSlug', learnViewController.getProductAnalytics);
router.get('/analytics/category/:categorySlug', learnViewController.getCategoryAnalytics);

export default router;