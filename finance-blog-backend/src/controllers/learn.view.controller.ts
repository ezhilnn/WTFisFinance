// src/controllers/learn.view.controller.ts

import { Request, Response } from 'express';
import * as learnViewModel from '../models/learn.view.model';
import { sendSuccess, sendError } from '../utils/response.util';
import { LearnViewRequest } from '../types/learn.view.types';

/**
 * Record a learn product view
 * POST /api/learn/view
 */
export const recordView = async (req: Request, res: Response): Promise<void> => {
  try {
    const viewData: LearnViewRequest = req.body;

    // Validate required fields
    if (!viewData.sessionId || !viewData.categorySlug || !viewData.productSlug) {
      sendError(res, 'Missing required fields', 400);
      return;
    }

    // Check if already viewed (optional - prevent spam)
    const alreadyViewed = await learnViewModel.hasViewedProduct(
      viewData.sessionId,
      viewData.productSlug
    );

    if (alreadyViewed && !viewData.engaged) {
      // If already viewed and this is not an engaged event, skip
      sendSuccess(res, { recorded: false, reason: 'Already viewed' });
      return;
    }

    // Record the view
    const view = await learnViewModel.recordLearnView(viewData);

    sendSuccess(res, { recorded: true, view }, 'View recorded successfully', 201);
  } catch (error) {
    console.error('Record learn view error:', error);
    sendError(res, 'Failed to record view');
  }
};

/**
 * Get analytics for a product
 * GET /api/learn/analytics/product/:productSlug
 */
export const getProductAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productSlug } = req.params;

    const [viewCount, engagedCount] = await Promise.all([
      learnViewModel.getProductViewCount(productSlug),
      learnViewModel.getProductEngagedCount(productSlug),
    ]);

    const engagementRate = viewCount > 0 ? (engagedCount / viewCount) * 100 : 0;

    sendSuccess(res, {
      productSlug,
      totalViews: viewCount,
      engagedViews: engagedCount,
      engagementRate: Math.round(engagementRate * 100) / 100,
    });
  } catch (error) {
    console.error('Get product analytics error:', error);
    sendError(res, 'Failed to fetch analytics');
  }
};

/**
 * Get analytics for a category
 * GET /api/learn/analytics/category/:categorySlug
 */
export const getCategoryAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    const { categorySlug } = req.params;

    const analytics = await learnViewModel.getCategoryAnalytics(categorySlug);

    sendSuccess(res, {
      categorySlug,
      ...analytics,
      engagementRate: Math.round(analytics.engagementRate * 100) / 100,
    });
  } catch (error) {
    console.error('Get category analytics error:', error);
    sendError(res, 'Failed to fetch analytics');
  }
};