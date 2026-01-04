import { Request, Response } from 'express';
import * as likeModel from '../models/like.model';
import * as blogModel from '../models/blog.model';
import * as commentModel from '../models/comment.model';
import { sendSuccess, sendError, notFound, badRequest } from '../utils/response.util';

// Generate session ID from request (simple fingerprinting)
const getSessionId = (req: Request): string => {
  // Use IP + User-Agent as a simple session identifier
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const userAgent = req.headers['user-agent'] || 'unknown';
  return `${ip}-${userAgent}`;
};

// Toggle like (add or remove) - Public
export const toggleLike = async (req: Request, res: Response): Promise<void> => {
  try {
    const { targetId, targetType } = req.body;
    const sessionId = getSessionId(req);
    
    // Verify target exists
    if (targetType === 'blog') {
      const blog = await blogModel.getBlogById(targetId);
      if (!blog) {
        notFound(res, 'Blog');
        return;
      }
    } else if (targetType === 'comment') {
      const comment = await commentModel.getCommentById(targetId);
      if (!comment) {
        notFound(res, 'Comment');
        return;
      }
    } else {
      badRequest(res, 'Invalid target type');
      return;
    }
    
    // Check if already liked
    const hasLiked = await likeModel.hasLiked(targetId, sessionId);
    
    if (hasLiked) {
      // Remove like
      await likeModel.removeLike(targetId, targetType, sessionId);
      sendSuccess(res, { liked: false }, 'Like removed');
    } else {
      // Add like
      await likeModel.addLike(targetId, targetType, sessionId);
      sendSuccess(res, { liked: true }, 'Like added');
    }
  } catch (error) {
    console.error('Toggle like error:', error);
    sendError(res, 'Failed to toggle like');
  }
};

// Check if user has liked (Public)
export const checkLikeStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { targetId } = req.params;
    const sessionId = getSessionId(req);
    
    const hasLiked = await likeModel.hasLiked(targetId, sessionId);
    sendSuccess(res, { liked: hasLiked });
  } catch (error) {
    console.error('Check like status error:', error);
    sendError(res, 'Failed to check like status');
  }
};

// Get like count for a target (Public)
export const getLikeCount = async (req: Request, res: Response): Promise<void> => {
  try {
    const { targetId } = req.params;
    const count = await likeModel.getLikeCount(targetId);
    sendSuccess(res, { count });
  } catch (error) {
    console.error('Get like count error:', error);
    sendError(res, 'Failed to get like count');
  }
};