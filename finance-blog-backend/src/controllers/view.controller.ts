import { Request, Response } from 'express';
import * as viewModel from '../models/view.model';
import * as blogModel from '../models/blog.model';
import { sendSuccess, sendError, notFound } from '../utils/response.util';

// Generate session ID from request
const getSessionId = (req: Request): string => {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const userAgent = req.headers['user-agent'] || 'unknown';
  return `${ip}-${userAgent}`;
};

// Record a view (Public)
export const recordView = async (req: Request, res: Response): Promise<void> => {
  try {
    const { blogId } = req.body;
    const sessionId = getSessionId(req);
    
    // Verify blog exists
    const blog = await blogModel.getBlogById(blogId);
    if (!blog || !blog.published) {
      notFound(res, 'Blog');
      return;
    }
    
    const result = await viewModel.recordView(blogId, sessionId);
    sendSuccess(res, result);
  } catch (error) {
    console.error('Record view error:', error);
    sendError(res, 'Failed to record view');
  }
};

// Record an engaged read (≥15 seconds) - Public
export const recordEngagedRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const { blogId } = req.body;
    const sessionId = getSessionId(req);
    
    // Verify blog exists
    const blog = await blogModel.getBlogById(blogId);
    if (!blog) {
      notFound(res, 'Blog');
      return;
    }
    
    const result = await viewModel.recordEngagedRead(blogId, sessionId);
    sendSuccess(res, result);
  } catch (error) {
    console.error('Record engaged read error:', error);
    sendError(res, 'Failed to record engaged read');
  }
};