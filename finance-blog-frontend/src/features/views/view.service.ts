// src/features/views/services/view.service.ts

import { api } from "../../services/api";

// Record a view
export const recordView = async (blogId: string): Promise<{ recorded: boolean }> => {
  try {
    const response = await api.post<{ recorded: boolean }>('/views/view', {
      blogId,
    });

    if (!response.success) {
      console.warn('Failed to record view:', response.error);
      return { recorded: false };
    }

    return response.data || { recorded: false };
  } catch (error) {
    console.warn('Error recording view:', error);
    return { recorded: false };
  }
};

// Record an engaged read (15+ seconds)
export const recordEngagedRead = async (blogId: string): Promise<{ recorded: boolean }> => {
  try {
    const response = await api.post<{ recorded: boolean }>('/views/engaged', {
      blogId,
    });

    if (!response.success) {
      console.warn('Failed to record engaged read:', response.error);
      return { recorded: false };
    }

    return response.data || { recorded: false };
  } catch (error) {
    console.warn('Error recording engaged read:', error);
    return { recorded: false };
  }
};