import { Request, Response, NextFunction } from 'express';
import { badRequest } from '../utils/response.util';
import { isValidEmail, isValidName, isValidContent } from '../utils/validators.util';

// Validate blog creation request
export const validateBlogCreate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { title, content, tags } = req.body;

  if (!title || title.trim().length === 0) {
    badRequest(res, 'Title is required');
    return;
  }

  if (title.length > 200) {
    badRequest(res, 'Title must be less than 200 characters');
    return;
  }

  if (!content || !Array.isArray(content) || content.length === 0) {
    badRequest(res, 'Content is required and must be an array');
    return;
  }

  if (!tags || !Array.isArray(tags)) {
    badRequest(res, 'Tags must be an array');
    return;
  }

  next();
};

// Validate comment creation request
export const validateCommentCreate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { blogId, content, name, email } = req.body;

  if (!blogId || blogId.trim().length === 0) {
    badRequest(res, 'Blog ID is required');
    return;
  }

  if (!isValidContent(content)) {
    badRequest(res, 'Valid content is required (1-10000 characters)');
    return;
  }

  if (!isValidName(name)) {
    badRequest(res, 'Valid name is required (2-50 characters, letters only)');
    return;
  }

  if (!isValidEmail(email)) {
    badRequest(res, 'Valid email is required');
    return;
  }

  next();
};

// Validate like creation request
export const validateLikeCreate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { targetId, targetType } = req.body;

  if (!targetId || targetId.trim().length === 0) {
    badRequest(res, 'Target ID is required');
    return;
  }

  if (!targetType || !['blog', 'comment'].includes(targetType)) {
    badRequest(res, 'Target type must be either "blog" or "comment"');
    return;
  }

  next();
};