// src/features/comments/store/comment.slice.ts

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {
  CommentState,
  Comment,
  FetchCommentsPayload,
  CreateCommentPayload,
  DeleteCommentPayload,
  SetReplyingToPayload,
} from '../types/comment.types';

const initialState: CommentState = {
  commentsByBlog: {},
  isLoading: false,
  isSubmitting: false,
  error: null,
  replyingTo: null,
};

const commentSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    // Fetch comments for a blog
    fetchCommentsRequest: (state, _action: PayloadAction<FetchCommentsPayload>) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchCommentsSuccess: (
      state,
      action: PayloadAction<{ blogId: string; comments: Comment[] }>
    ) => {
      state.isLoading = false;
      state.commentsByBlog[action.payload.blogId] = action.payload.comments;
    },
    fetchCommentsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Create comment
    createCommentRequest: (state, _action: PayloadAction<CreateCommentPayload>) => {
      state.isSubmitting = true;
      state.error = null;
    },
    createCommentSuccess: (
      state,
      action: PayloadAction<{ blogId: string; comment: Comment }>
    ) => {
      state.isSubmitting = false;
      const { blogId, comment } = action.payload;
      if (!state.commentsByBlog[blogId]) {
        state.commentsByBlog[blogId] = [];
      }
      state.commentsByBlog[blogId].push(comment);
      state.replyingTo = null;
    },
    createCommentFailure: (state, action: PayloadAction<string>) => {
      state.isSubmitting = false;
      state.error = action.payload;
    },

    // Delete comment
    deleteCommentRequest: (state, _action: PayloadAction<DeleteCommentPayload>) => {
      state.isLoading = true;
      state.error = null;
    },
    deleteCommentSuccess: (
      state,
      action: PayloadAction<{ blogId: string; commentId: string }>
    ) => {
      state.isLoading = false;
      const { blogId, commentId } = action.payload;
      if (state.commentsByBlog[blogId]) {
        state.commentsByBlog[blogId] = state.commentsByBlog[blogId].filter(
          (c) => c.id !== commentId
        );
      }
    },
    deleteCommentFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Set replying to
    setReplyingTo: (state, action: PayloadAction<SetReplyingToPayload>) => {
      state.replyingTo = action.payload.commentId;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Clear comments for a blog
    clearComments: (state, action: PayloadAction<{ blogId: string }>) => {
      delete state.commentsByBlog[action.payload.blogId];
    },
  },
});

export const {
  fetchCommentsRequest,
  fetchCommentsSuccess,
  fetchCommentsFailure,
  createCommentRequest,
  createCommentSuccess,
  createCommentFailure,
  deleteCommentRequest,
  deleteCommentSuccess,
  deleteCommentFailure,
  setReplyingTo,
  clearError,
  clearComments,
} = commentSlice.actions;

export default commentSlice.reducer;