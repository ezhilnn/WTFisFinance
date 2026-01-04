import { Response } from 'express';
import { ApiResponse } from '../types/common.types';

// Standardized success response
export const sendSuccess = <T>(
  res: Response,
  data: T,
  message: string = 'Success',
  statusCode: number = 200
): Response => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
  };
  return res.status(statusCode).json(response);
};

// Standardized error response
export const sendError = (
  res: Response,
  message: string = 'An error occurred',
  statusCode: number = 500,
  error?: string
): Response => {
  const response: ApiResponse = {
    success: false,
    message,
    error,
  };
  return res.status(statusCode).json(response);
};

// Common error responses
export const notFound = (res: Response, resource: string = 'Resource') =>
  sendError(res, `${resource} not found`, 404);

export const badRequest = (res: Response, message: string) =>
  sendError(res, message, 400);

export const unauthorized = (res: Response, message: string = 'Unauthorized') =>
  sendError(res, message, 401);

export const forbidden = (res: Response, message: string = 'Forbidden') =>
  sendError(res, message, 403);