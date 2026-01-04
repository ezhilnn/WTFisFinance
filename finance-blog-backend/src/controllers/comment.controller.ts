import { Request, Response } from 'express';
import * as commentModel from '../models/comment.model';
import * as blogModel from '../models/blog.model';
import { sendSuccess, sendError, notFound, badRequest } from '../utils/response.util';

// Create a new comment (Public - no auth required)
export const createComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { blogId, content, name, email, parentId } = req.body;
    
    // Verify blog exists
    const blog = await blogModel.getBlogById(blogId);
    if (!blog || !blog.published) {
      notFound(res, 'Blog');
      return;
    }
    
    // If replying to a comment, verify parent exists
    if (parentId) {
      const parentComment = await commentModel.getCommentById(parentId);
      if (!parentComment || parentComment.blogId !== blogId) {
        badRequest(res, 'Invalid parent comment');
        return;
      }
    }
    
    const comment = await commentModel.createComment({
      blogId,
      content,
      name,
      email,
      parentId,
    });
    
    // Return public version (without email)
    sendSuccess(
      res,
      {
        ...comment,
        user: { name: comment.user.name },
      },
      'Comment posted successfully',
      201
    );
  } catch (error) {
    console.error('Create comment error:', error);
    sendError(res, 'Failed to post comment');
  }
};

// Get all comments for a blog (Public)
export const getCommentsByBlog = async (req: Request, res: Response): Promise<void> => {
  try {
    const { blogId } = req.params;
    
    // Verify blog exists
    const blog = await blogModel.getBlogById(blogId);
    if (!blog) {
      notFound(res, 'Blog');
      return;
    }
    
    const comments = await commentModel.getCommentsByBlogId(blogId);
    sendSuccess(res, comments);
  } catch (error) {
    console.error('Get comments error:', error);
    sendError(res, 'Failed to fetch comments');
  }
};

// Get replies to a comment (Public)
export const getRepliesByComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { commentId } = req.params;
    
    // Verify parent comment exists
    const parentComment = await commentModel.getCommentById(commentId);
    if (!parentComment) {
      notFound(res, 'Comment');
      return;
    }
    
    const replies = await commentModel.getRepliesByParentId(commentId);
    sendSuccess(res, replies);
  } catch (error) {
    console.error('Get replies error:', error);
    sendError(res, 'Failed to fetch replies');
  }
};

// Delete comment (Admin only - implement in routes)
export const deleteComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const comment = await commentModel.getCommentById(id);
    if (!comment) {
      notFound(res, 'Comment');
      return;
    }
    
    await commentModel.deleteComment(id);
    sendSuccess(res, null, 'Comment deleted successfully');
  } catch (error) {
    console.error('Delete comment error:', error);
    sendError(res, 'Failed to delete comment');
  }
};