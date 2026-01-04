import { Router } from 'express';
import * as tagController from '../controllers/tag.controller';
import { verifyAdmin } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.get('/', tagController.getAllTags);
router.get('/:id', tagController.getTagById);
router.get('/slug/:slug', tagController.getTagBySlug);

// Admin routes (protected)
router.post('/', verifyAdmin, tagController.createTag);

export default router;