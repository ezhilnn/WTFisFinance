// src/features/likes/services/like.service.ts

import { api } from '../../../services/api';

// Toggle like on any target (blog or comment)
export const toggleLike = async (
  targetId: string,
  targetType: 'blog' | 'comment'
): Promise<{ liked: boolean }> => {
  const response = await api.post<{ liked: boolean }>('/likes/toggle', {
    targetId,
    targetType,
  });

  if (!response.success || !response.data) {
    throw new Error(response.error || 'Failed to toggle like');
  }

  return response.data;
};

// Check if user has liked
export const checkLikeStatus = async (targetId: string): Promise<{ liked: boolean }> => {
  const response = await api.get<{ liked: boolean }>(`/likes/status/${targetId}`);

  if (!response.success || !response.data) {
    throw new Error(response.error || 'Failed to check like status');
  }

  return response.data;
};

// Get like count
export const getLikeCount = async (targetId: string): Promise<{ count: number }> => {
  const response = await api.get<{ count: number }>(`/likes/count/${targetId}`);

  if (!response.success || !response.data) {
    throw new Error(response.error || 'Failed to get like count');
  }

  return response.data;
};