import { Router } from 'express';
import * as commentController from '../controllers/comment.controller';
import { verifyAdmin } from '../middleware/auth.middleware';
import { validateCommentCreate } from '../middleware/validation.middleware';

const router = Router();

// Public routes (no auth required)
router.post('/', validateCommentCreate, commentController.createComment);
router.get('/blog/:blogId', commentController.getCommentsByBlog);
router.get('/:commentId/replies', commentController.getRepliesByComment);

// Admin routes (protected)
router.delete('/:id', verifyAdmin, commentController.deleteComment);

export default router;