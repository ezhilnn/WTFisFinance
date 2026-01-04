import { call, put, takeLatest } from 'redux-saga/effects';
import type { PayloadAction } from '@reduxjs/toolkit';
import {
  fetchBlogsRequest,
  fetchBlogsSuccess,
  fetchBlogsFailure,
  fetchBlogBySlugRequest,
  fetchBlogBySlugSuccess,
  fetchBlogBySlugFailure,
  createBlogRequest,
  createBlogSuccess,
  createBlogFailure,
  updateBlogRequest,
  updateBlogSuccess,
  updateBlogFailure,
  deleteBlogRequest,
  deleteBlogSuccess,
  deleteBlogFailure,
  fetchTagsRequest,
  fetchTagsSuccess,
  fetchTagsFailure,
} from './blog.slice';
import * as blogService from '../services/blog.service';
import type {
    FetchBlogsPayload,
    FetchBlogBySlugPayload,
    CreateBlogPayload,
    UpdateBlogPayload,
    DeleteBlogPayload,
    Blog,
    Tag,
} from '../types/blog.types';
import type { PaginatedResponse } from '../../../types/common.types';

// Fetch blogs saga
function* fetchBlogsSaga(action: PayloadAction<FetchBlogsPayload>) {
  try {
    const { page = 1, limit = 10 } = action.payload;
    const response: PaginatedResponse<Blog> = yield call(
      blogService.getPublishedBlogs,
      page,
      limit
    );
    yield put(fetchBlogsSuccess(response));
  } catch (error: any) {
    yield put(fetchBlogsFailure(error.message || 'Failed to fetch blogs'));
  }
}

// Fetch blog by slug saga
function* fetchBlogBySlugSaga(action: PayloadAction<FetchBlogBySlugPayload>) {
  try {
    const blog: Blog = yield call(blogService.getBlogBySlug, action.payload.slug);
    yield put(fetchBlogBySlugSuccess(blog));
  } catch (error: any) {
    yield put(fetchBlogBySlugFailure(error.message || 'Failed to fetch blog'));
  }
}

// Create blog saga
function* createBlogSaga(action: PayloadAction<CreateBlogPayload>) {
  try {
    const { data, onSuccess, onError } = action.payload;
    const blog: Blog = yield call(blogService.createBlog, data);
    yield put(createBlogSuccess(blog));

    if (onSuccess) {
      onSuccess(blog);
    }
  } catch (error: any) {
    const errorMessage = error.message || 'Failed to create blog';
    yield put(createBlogFailure(errorMessage));

    if (action.payload.onError) {
      action.payload.onError(errorMessage);
    }
  }
}

// Update blog saga
function* updateBlogSaga(action: PayloadAction<UpdateBlogPayload>) {
  try {
    const { data, onSuccess, onError } = action.payload;
    const blog: Blog = yield call(blogService.updateBlog, data);
    yield put(updateBlogSuccess(blog));

    if (onSuccess) {
      onSuccess(blog);
    }
  } catch (error: any) {
    const errorMessage = error.message || 'Failed to update blog';
    yield put(updateBlogFailure(errorMessage));

    if (action.payload.onError) {
      action.payload.onError(errorMessage);
    }
  }
}

// Delete blog saga
function* deleteBlogSaga(action: PayloadAction<DeleteBlogPayload>) {
  try {
    const { id, onSuccess, onError } = action.payload;
    yield call(blogService.deleteBlog, id);
    yield put(deleteBlogSuccess(id));

    if (onSuccess) {
      onSuccess();
    }
  } catch (error: any) {
    const errorMessage = error.message || 'Failed to delete blog';
    yield put(deleteBlogFailure(errorMessage));

    if (action.payload.onError) {
      action.payload.onError(errorMessage);
    }
  }
}

// Fetch tags saga
function* fetchTagsSaga() {
  try {
    const tags: Tag[] = yield call(blogService.getAllTags);
    yield put(fetchTagsSuccess(tags));
  } catch (error: any) {
    yield put(fetchTagsFailure(error.message || 'Failed to fetch tags'));
  }
}

// Root blog saga
export default function* blogSaga() {
  yield takeLatest(fetchBlogsRequest.type, fetchBlogsSaga);
  yield takeLatest(fetchBlogBySlugRequest.type, fetchBlogBySlugSaga);
  yield takeLatest(createBlogRequest.type, createBlogSaga);
  yield takeLatest(updateBlogRequest.type, updateBlogSaga);
  yield takeLatest(deleteBlogRequest.type, deleteBlogSaga);
  yield takeLatest(fetchTagsRequest.type, fetchTagsSaga);
}