import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response.util';

// Global error handler middleware
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', err);

  // Send error response
  sendError(
    res,
    'Internal server error',
    500,
    process.env.NODE_ENV === 'development' ? err.message : undefined
  );
};

// 404 handler for undefined routes
export const notFoundHandler = (
  req: Request,
  res: Response
): void => {
  sendError(res, `Route ${req.originalUrl} not found`, 404);
};