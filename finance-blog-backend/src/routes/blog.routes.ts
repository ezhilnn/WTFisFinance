import { Router } from 'express';
import * as blogController from '../controllers/blog.controller';
import { verifyAdmin } from '../middleware/auth.middleware';
import { validateBlogCreate } from '../middleware/validation.middleware';

const router = Router();

// Public routes
router.get('/published', blogController.getPublishedBlogs);
router.get('/slug/:slug', blogController.getBlogBySlug);
router.get('/tag/:tagId', blogController.getBlogsByTag);

// Admin routes (protected)
router.post('/', verifyAdmin, validateBlogCreate, blogController.createBlog);
router.get('/', verifyAdmin, blogController.getAllBlogs);
router.get('/:id', verifyAdmin, blogController.getBlogById);
router.put('/:id', verifyAdmin, blogController.updateBlog);
router.delete('/:id', verifyAdmin, blogController.deleteBlog);

export default router;