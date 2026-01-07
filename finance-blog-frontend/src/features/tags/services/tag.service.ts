// src/features/tags/services/tag.service.ts

import { api } from '../../../services/api';
import type { Tag } from '../types/tag.types';

// Get all tags
export const getAllTags = async (): Promise<Tag[]> => {
  const response = await api.get<Tag[]>('/tags');

  if (!response.success || !response.data) {
    throw new Error(response.error || 'Failed to fetch tags');
  }

  return response.data;
};