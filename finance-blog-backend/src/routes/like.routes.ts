import { Router } from 'express';
import * as likeController from '../controllers/like.controller';
import { validateLikeCreate } from '../middleware/validation.middleware';

const router = Router();

// Public routes (no auth required)
router.post('/toggle', validateLikeCreate, likeController.toggleLike);
router.get('/status/:targetId', likeController.checkLikeStatus);
router.get('/count/:targetId', likeController.getLikeCount);

export default router;