// src/features/learn/services/learn.view.service.ts

import { api } from '../../../services/api';

/**
 * Generate browser fingerprint as session ID
 */
export const generateSessionId = (): string => {
  // Check if session ID exists in sessionStorage
  const existing = sessionStorage.getItem('learn_session_id');
  if (existing) return existing;

  // Generate new session ID
  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  sessionStorage.setItem('learn_session_id', sessionId);
  return sessionId;
};

/**
 * Record a product view
 */
export const recordProductView = async (
  categorySlug: string,
  productSlug: string,
  subAnchorId?: string
): Promise<{ recorded: boolean }> => {
  try {
    const sessionId = generateSessionId();

    const response = await api.post<{ recorded: boolean }>('/learn/view', {
      sessionId,
      categorySlug,
      productSlug,
      subAnchorId,
      viewedAt: new Date().toISOString(),
      engaged: false,
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

/**
 * Record engaged view (15+ seconds)
 */
export const recordEngagedView = async (
  categorySlug: string,
  productSlug: string,
  subAnchorId?: string
): Promise<{ recorded: boolean }> => {
  try {
    const sessionId = generateSessionId();

    const response = await api.post<{ recorded: boolean }>('/learn/view', {
      sessionId,
      categorySlug,
      productSlug,
      subAnchorId,
      viewedAt: new Date().toISOString(),
      engaged: true,
    });

    if (!response.success) {
      console.warn('Failed to record engaged view:', response.error);
      return { recorded: false };
    }

    return response.data || { recorded: false };
  } catch (error) {
    console.warn('Error recording engaged view:', error);
    return { recorded: false };
  }
};