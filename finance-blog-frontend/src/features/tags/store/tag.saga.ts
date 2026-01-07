// src/features/tags/store/tag.saga.ts

import { call, put, takeLatest } from 'redux-saga/effects';
import type { PayloadAction } from '@reduxjs/toolkit';
import {
  fetchTagsRequest,
  fetchTagsSuccess,
  fetchTagsFailure,
} from './tag.slice';
import * as tagService from '../services/tag.service';
import type { Tag, FetchTagsPayload } from '../types/tag.types';

// Fetch tags saga
function* fetchTagsSaga(_action: PayloadAction<FetchTagsPayload>) {
  try {
    const tags: Tag[] = yield call(tagService.getAllTags);
    yield put(fetchTagsSuccess(tags));
  } catch (error: any) {
    yield put(fetchTagsFailure(error.message || 'Failed to fetch tags'));
  }
}

// Root tag saga
export default function* tagSaga() {
  yield takeLatest(fetchTagsRequest.type, fetchTagsSaga);
}