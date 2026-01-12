// src/types/learn.view.types.ts

export interface LearnViewRequest {
  sessionId: string;
  categorySlug: string;
  productSlug: string;
  subAnchorId?: string;
  viewedAt: string;
  engaged: boolean;
}

export interface LearnView {
  id: string;
  sessionId: string;
  categorySlug: string;
  productSlug: string;
  subAnchorId?: string;
  viewedAt: string;
  engaged: boolean;
  createdAt: string;
}