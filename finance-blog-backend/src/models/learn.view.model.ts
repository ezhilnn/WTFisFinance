// src/models/learn.view.model.ts

import { db } from '../config/firebase';
import { COLLECTIONS } from '../config/constants';
import { LearnView, LearnViewRequest } from '../types/learn.view.types';

const learnViewsCollection = db.collection(COLLECTIONS.LEARN_VIEWS);

/**
 * Record a learn product view
 */
export const recordLearnView = async (
  viewData: LearnViewRequest
): Promise<LearnView> => {
  const now = new Date().toISOString();

  const view: Omit<LearnView, 'id'> = {
    sessionId: viewData.sessionId,
    categorySlug: viewData.categorySlug,
    productSlug: viewData.productSlug,
    subAnchorId: viewData.subAnchorId,
    viewedAt: viewData.viewedAt,
    engaged: viewData.engaged,
    createdAt: now,
  };

  const docRef = await learnViewsCollection.add(view);
  return { ...view, id: docRef.id };
};

/**
 * Check if session already viewed this product (to prevent duplicate counting)
 */
export const hasViewedProduct = async (
  sessionId: string,
  productSlug: string
): Promise<boolean> => {
  const snapshot = await learnViewsCollection
    .where('sessionId', '==', sessionId)
    .where('productSlug', '==', productSlug)
    .limit(1)
    .get();

  return !snapshot.empty;
};

/**
 * Get view count for a product
 */
export const getProductViewCount = async (productSlug: string): Promise<number> => {
  const snapshot = await learnViewsCollection
    .where('productSlug', '==', productSlug)
    .count()
    .get();

  return snapshot.data().count;
};

/**
 * Get engaged view count for a product
 */
export const getProductEngagedCount = async (productSlug: string): Promise<number> => {
  const snapshot = await learnViewsCollection
    .where('productSlug', '==', productSlug)
    .where('engaged', '==', true)
    .count()
    .get();

  return snapshot.data().count;
};

/**
 * Get analytics for a category
 */
export const getCategoryAnalytics = async (categorySlug: string) => {
  const snapshot = await learnViewsCollection
    .where('categorySlug', '==', categorySlug)
    .get();

  const totalViews = snapshot.size;
  const engagedViews = snapshot.docs.filter((doc) => doc.data().engaged).length;

  return {
    totalViews,
    engagedViews,
    engagementRate: totalViews > 0 ? (engagedViews / totalViews) * 100 : 0,
  };
};