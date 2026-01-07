// src/features/comments/store/comment.saga.ts

import { call, put, takeLatest } from 'redux-saga/effects';
import type { PayloadAction } from '@reduxjs/toolkit';
import {
  fetchCommentsRequest,
  fetchCommentsSuccess,
  fetchCommentsFailure,
  createCommentRequest,
  createCommentSuccess,
  createCommentFailure,
  deleteCommentRequest,
  deleteCommentSuccess,
  deleteCommentFailure,
} from './comment.slice';
import * as commentService from '../services/comment.service';
import type {
  Comment,
  FetchCommentsPayload,
  CreateCommentPayload,
  DeleteCommentPayload,
} from '../types/comment.types';

// Fetch comments saga
function* fetchCommentsSaga(action: PayloadAction<FetchCommentsPayload>) {
  try {
    const { blogId } = action.payload;
    const comments: Comment[] = yield call(commentService.getCommentsByBlog, blogId);
    yield put(fetchCommentsSuccess({ blogId, comments }));
  } catch (error: any) {
    yield put(fetchCommentsFailure(error.message || 'Failed to fetch comments'));
  }
}

// Create comment saga
function* createCommentSaga(action: PayloadAction<CreateCommentPayload>) {
  try {
    const { data, onSuccess, onError } = action.payload;
    const comment: Comment = yield call(commentService.createComment, data);
    
    yield put(createCommentSuccess({ blogId: data.blogId, comment }));

    if (onSuccess) {
      onSuccess(comment);
    }
  } catch (error: any) {
    const errorMessage = error.message || 'Failed to create comment';
    yield put(createCommentFailure(errorMessage));

    if (action.payload.onError) {
      action.payload.onError(errorMessage);
    }
  }
}

// Delete comment saga
function* deleteCommentSaga(action: PayloadAction<DeleteCommentPayload>) {
  try {
    const { id, blogId, onSuccess, onError } = action.payload;
    yield call(commentService.deleteComment, id);
    
    yield put(deleteCommentSuccess({ blogId, commentId: id }));

    if (onSuccess) {
      onSuccess();
    }
  } catch (error: any) {
    const errorMessage = error.message || 'Failed to delete comment';
    yield put(deleteCommentFailure(errorMessage));

    if (action.payload.onError) {
      action.payload.onError(errorMessage);
    }
  }
}

// Root comment saga
export default function* commentSaga() {
  yield takeLatest(fetchCommentsRequest.type, fetchCommentsSaga);
  yield takeLatest(createCommentRequest.type, createCommentSaga);
  yield takeLatest(deleteCommentRequest.type, deleteCommentSaga);
}