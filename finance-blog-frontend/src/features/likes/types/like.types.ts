// src/features/likes/types/like.types.ts

export interface LikeState {
  likedBlogs: Record<string, boolean>; // blogId -> isLiked
  likeCounts: Record<string, number>; // targetId -> count
  isLoading: Record<string, boolean>; // targetId -> loading state
}

export interface ToggleLikePayload {
  targetId: string;
  targetType: 'blog' | 'comment';
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export interface CheckLikeStatusPayload {
  targetId: string;
}

export interface GetLikeCountPayload {
  targetId: string;
}