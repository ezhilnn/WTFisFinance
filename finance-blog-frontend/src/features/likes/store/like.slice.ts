// src/features/likes/store/like.slice.ts

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {
  LikeState,
  ToggleLikePayload,
  CheckLikeStatusPayload,
} from '../types/like.types';

const initialState: LikeState = {
  likedBlogs: {},
  likeCounts: {},
  isLoading: {},
};

const likeSlice = createSlice({
  name: 'likes',
  initialState,
  reducers: {
    // Toggle like
    toggleLikeRequest: (state, action: PayloadAction<ToggleLikePayload>) => {
      state.isLoading[action.payload.targetId] = true;
    },
    toggleLikeSuccess: (
      state,
      action: PayloadAction<{ targetId: string; liked: boolean; targetType: 'blog' | 'comment' }>
    ) => {
      const { targetId, liked, targetType } = action.payload;
      state.isLoading[targetId] = false;
      
      if (targetType === 'blog') {
        state.likedBlogs[targetId] = liked;
      }
      
      // Update like count optimistically
      if (!state.likeCounts[targetId]) {
        state.likeCounts[targetId] = 0;
      }
      state.likeCounts[targetId] += liked ? 1 : -1;
    },
    toggleLikeFailure: (
      state,
      action: PayloadAction<{ targetId: string; error: string }>
    ) => {
      state.isLoading[action.payload.targetId] = false;
    },

    // Check like status
    checkLikeStatusRequest: (state, _action: PayloadAction<CheckLikeStatusPayload>) => {
      // No loading state needed for background check
    },
    checkLikeStatusSuccess: (
      state,
      action: PayloadAction<{ targetId: string; liked: boolean }>
    ) => {
      const { targetId, liked } = action.payload;
      state.likedBlogs[targetId] = liked;
    },

    // Set like count (from blog data)
    setLikeCount: (
      state,
      action: PayloadAction<{ targetId: string; count: number }>
    ) => {
      const { targetId, count } = action.payload;
      state.likeCounts[targetId] = count;
    },

    // Clear likes
    clearLikes: (state) => {
      state.likedBlogs = {};
      state.likeCounts = {};
      state.isLoading = {};
    },
  },
});

export const {
  toggleLikeRequest,
  toggleLikeSuccess,
  toggleLikeFailure,
  checkLikeStatusRequest,
  checkLikeStatusSuccess,
  setLikeCount,
  clearLikes,
} = likeSlice.actions;

export default likeSlice.reducer;