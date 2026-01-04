import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import * as blogModel from '../models/blog.model';
import * as tagModel from '../models/tag.model';
import { sendSuccess, sendError, notFound } from '../utils/response.util';
import { PAGINATION } from '../config/constants';

// Create a new blog (Admin only)
export const createBlog = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, content, tags, published } = req.body;
    
    // Get or create tags
    const tagIds = await tagModel.getOrCreateTags(tags);
    
    // Create blog
    const blog = await blogModel.createBlog(
      { title, content, tags: tagIds, published },
      req.user!.email,
      req.user!.name || req.user!.email
    );
    
    // Increment tag blog counts
    for (const tagId of tagIds) {
      await tagModel.incrementTagBlogCount(tagId);
    }
    
    sendSuccess(res, blog, 'Blog created successfully', 201);
  } catch (error) {
    console.error('Create blog error:', error);
    sendError(res, 'Failed to create blog');
  }
};

// Get all published blogs (Public)
// export const getPublishedBlogs = async (req: AuthRequest, res: Response): Promise<void> => {
//   try {
//     const page = parseInt(req.query.page as string) || PAGINATION.DEFAULT_PAGE;
//     const limit = Math.min(
//       parseInt(req.query.limit as string) || PAGINATION.DEFAULT_LIMIT,
//       PAGINATION.MAX_LIMIT
//     );
    
//     const { blogs, total } = await blogModel.getAllPublishedBlogs(page, limit);
//     console.log(blogs,total);
    
//     sendSuccess(res, {
//       blogs,
//       pagination: {
//         page,
//         limit,
//         total,
//         totalPages: Math.ceil(total / limit),
//       },
//     });
//   } catch (error) {
//     console.error('Get published blogs error:', error);
//     sendError(res, 'Failed to fetch blogs');
//   }
// };
export const getPublishedBlogs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || PAGINATION.DEFAULT_PAGE;
    const limit = Math.min(
      parseInt(req.query.limit as string) || PAGINATION.DEFAULT_LIMIT,
      PAGINATION.MAX_LIMIT
    );
    
    const { blogs, total } = await blogModel.getAllPublishedBlogs(page, limit);
    
    // Debug logging
    console.log('Page:', page);
    console.log('Limit:', limit);
    console.log('Total:', total);
    console.log('Blogs returned:', blogs.length);
    console.log('Blogs:', JSON.stringify(blogs, null, 2));
    
    sendSuccess(res, {
      blogs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get published blogs error:', error);
    sendError(res, 'Failed to fetch blogs');
  }
};

// Get all blogs including unpublished (Admin only)
export const getAllBlogs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || PAGINATION.DEFAULT_PAGE;
    const limit = Math.min(
      parseInt(req.query.limit as string) || PAGINATION.DEFAULT_LIMIT,
      PAGINATION.MAX_LIMIT
    );
    
    const { blogs, total } = await blogModel.getAllBlogs(page, limit);
    
    sendSuccess(res, {
      blogs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get all blogs error:', error);
    sendError(res, 'Failed to fetch blogs');
  }
};

// Get blog by slug (Public)
export const getBlogBySlug = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const blog = await blogModel.getBlogBySlug(slug);
    
    if (!blog) {
      notFound(res, 'Blog');
      return;
    }
    
    // Only return published blogs to non-admin users
    if (!blog.published && req.user?.email !== blog.authorEmail) {
      notFound(res, 'Blog');
      return;
    }
    
    sendSuccess(res, blog);
  } catch (error) {
    console.error('Get blog by slug error:', error);
    sendError(res, 'Failed to fetch blog');
  }
};

// Get blog by ID (Admin only)
export const getBlogById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const blog = await blogModel.getBlogById(id);
    
    if (!blog) {
      notFound(res, 'Blog');
      return;
    }
    
    sendSuccess(res, blog);
  } catch (error) {
    console.error('Get blog by ID error:', error);
    sendError(res, 'Failed to fetch blog');
  }
};

// Update blog (Admin only)
export const updateBlog = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Check if blog exists
    const existingBlog = await blogModel.getBlogById(id);
    if (!existingBlog) {
      notFound(res, 'Blog');
      return;
    }
    
    // Handle tag updates
    if (updates.tags) {
      // Remove old tags counts
      for (const tagId of existingBlog.tags) {
        await tagModel.decrementTagBlogCount(tagId);
      }
      
      // Get or create new tags
      const tagIds = await tagModel.getOrCreateTags(updates.tags);
      updates.tags = tagIds;
      
      // Increment new tag counts
      for (const tagId of tagIds) {
        await tagModel.incrementTagBlogCount(tagId);
      }
    }
    
    const updatedBlog = await blogModel.updateBlog(id, updates);
    sendSuccess(res, updatedBlog, 'Blog updated successfully');
  } catch (error) {
    console.error('Update blog error:', error);
    sendError(res, 'Failed to update blog');
  }
};

// Delete blog (Admin only)
export const deleteBlog = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Check if blog exists
    const blog = await blogModel.getBlogById(id);
    if (!blog) {
      notFound(res, 'Blog');
      return;
    }
    
    // Decrement tag counts
    for (const tagId of blog.tags) {
      await tagModel.decrementTagBlogCount(tagId);
    }
    
    await blogModel.deleteBlog(id);
    sendSuccess(res, null, 'Blog deleted successfully');
  } catch (error) {
    console.error('Delete blog error:', error);
    sendError(res, 'Failed to delete blog');
  }
};

// Get blogs by tag (Public)
export const getBlogsByTag = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { tagId } = req.params;
    const blogs = await blogModel.getBlogsByTag(tagId);
    sendSuccess(res, blogs);
  } catch (error) {
    console.error('Get blogs by tag error:', error);
    sendError(res, 'Failed to fetch blogs');
  }
};