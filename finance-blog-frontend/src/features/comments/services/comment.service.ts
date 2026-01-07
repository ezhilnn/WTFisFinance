import { api } from '../../../services/api';
import type {
  Comment,
  CreateCommentRequest,
} from '../types/comment.types';

/**
 * Comment Service
 * Handles all comment-related API calls
 */

// Create a new comment (public)
export const createComment = async (
  data: CreateCommentRequest
): Promise<Comment> => {
  console.log(data);

  const response = await api.post<Comment>('/comments', data);

  if (!response.success || !response.data) {
    throw new Error(response.error || 'Failed to create comment');
  }

  return response.data;
};

// Get all comments for a blog (public)
export const getCommentsByBlog = async (
  blogId: string
): Promise<Comment[]> => {
  const response = await api.get<Comment[]>(`/comments/blog/${blogId}`);

  if (!response.success || !response.data) {
    throw new Error(response.error || 'Failed to fetch comments');
  }

  return response.data;
};

// Get replies for a comment (public)
export const getRepliesByComment = async (
  commentId: string
): Promise<Comment[]> => {
  const response = await api.get<Comment[]>(
    `/comments/${commentId}/replies`
  );

  if (!response.success || !response.data) {
    throw new Error(response.error || 'Failed to fetch replies');
  }

  return response.data;
};

// Delete comment (admin only)
export const deleteComment = async (id: string): Promise<void> => {
  const response = await api.delete(`/comments/${id}`);

  if (!response.success) {
    throw new Error(response.error || 'Failed to delete comment');
  }
};
