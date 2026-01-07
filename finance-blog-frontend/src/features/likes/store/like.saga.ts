// src/features/likes/store/like.saga.ts

import { call, put, takeLatest } from 'redux-saga/effects';
import type { PayloadAction } from '@reduxjs/toolkit';
import {
  toggleLikeRequest,
  toggleLikeSuccess,
  toggleLikeFailure,
  checkLikeStatusRequest,
  checkLikeStatusSuccess,
} from './like.slice';
import * as likeService from '../services/like.service';
import type {
  ToggleLikePayload,
  CheckLikeStatusPayload,
} from '../types/like.types';

// Toggle like saga
function* toggleLikeSaga(action: PayloadAction<ToggleLikePayload>) {
  try {
    const { targetId, targetType, onSuccess, onError } = action.payload;
    
    const result: { liked: boolean } = yield call(
      likeService.toggleLike,
      targetId,
      targetType
    );
    
    yield put(toggleLikeSuccess({ targetId, liked: result.liked, targetType }));

    if (onSuccess) {
      onSuccess();
    }
  } catch (error: any) {
    const errorMessage = error.message || 'Failed to toggle like';
    yield put(
      toggleLikeFailure({
        targetId: action.payload.targetId,
        error: errorMessage,
      })
    );

    if (action.payload.onError) {
      action.payload.onError(errorMessage);
    }
  }
}

// Check like status saga
function* checkLikeStatusSaga(action: PayloadAction<CheckLikeStatusPayload>) {
  try {
    const { targetId } = action.payload;
    
    const result: { liked: boolean } = yield call(
      likeService.checkLikeStatus,
      targetId
    );
    
    yield put(checkLikeStatusSuccess({ targetId, liked: result.liked }));
  } catch (error: any) {
    // Silently fail for like status checks
    console.error('Check like status error:', error);
  }
}

// Root like saga
export default function* likeSaga() {
  yield takeLatest(toggleLikeRequest.type, toggleLikeSaga);
  yield takeLatest(checkLikeStatusRequest.type, checkLikeStatusSaga);
}