import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {
    BlogState,
    Blog,
    Tag,
    FetchBlogsPayload,
    FetchBlogBySlugPayload,
    CreateBlogPayload,
    UpdateBlogPayload,
    DeleteBlogPayload,
} from '../types/blog.types';
import type { PaginatedResponse } from '../../../types/common.types';

const initialState: BlogState = {
  blogs: [],
  currentBlog: null,
  tags: [],
  isLoading: false,
  error: null,
  pagination: null,
};

const blogSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {
    // Fetch blogs (published or all)
    fetchBlogsRequest: (state, _action: PayloadAction<FetchBlogsPayload>) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchBlogsSuccess: (state, action: PayloadAction<PaginatedResponse<Blog>>) => {
      state.isLoading = false;
      state.blogs = action.payload.data;
      state.pagination = action.payload.pagination;
    },
    fetchBlogsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Fetch blog by slug
    fetchBlogBySlugRequest: (state, _action: PayloadAction<FetchBlogBySlugPayload>) => {
      state.isLoading = true;
      state.error = null;
      state.currentBlog = null;
    },
    fetchBlogBySlugSuccess: (state, action: PayloadAction<Blog>) => {
      state.isLoading = false;
      state.currentBlog = action.payload;
    },
    fetchBlogBySlugFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Create blog
    createBlogRequest: (state, _action: PayloadAction<CreateBlogPayload>) => {
      state.isLoading = true;
      state.error = null;
    },
    createBlogSuccess: (state, action: PayloadAction<Blog>) => {
      state.isLoading = false;
      state.blogs.unshift(action.payload);
    },
    createBlogFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Update blog
    updateBlogRequest: (state, _action: PayloadAction<UpdateBlogPayload>) => {
      state.isLoading = true;
      state.error = null;
    },
    updateBlogSuccess: (state, action: PayloadAction<Blog>) => {
      state.isLoading = false;
      const index = state.blogs.findIndex((b) => b.id === action.payload.id);
      if (index !== -1) {
        state.blogs[index] = action.payload;
      }
      if (state.currentBlog?.id === action.payload.id) {
        state.currentBlog = action.payload;
      }
    },
    updateBlogFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Delete blog
    deleteBlogRequest: (state, _action: PayloadAction<DeleteBlogPayload>) => {
      state.isLoading = true;
      state.error = null;
    },
    deleteBlogSuccess: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.blogs = state.blogs.filter((b) => b.id !== action.payload);
      if (state.currentBlog?.id === action.payload) {
        state.currentBlog = null;
      }
    },
    deleteBlogFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Fetch tags
    fetchTagsRequest: (state) => {
      state.error = null;
    },
    fetchTagsSuccess: (state, action: PayloadAction<Tag[]>) => {
      state.tags = action.payload;
    },
    fetchTagsFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },

    // Clear current blog
    clearCurrentBlog: (state) => {
      state.currentBlog = null;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
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
  clearCurrentBlog,
  clearError,
} = blogSlice.actions;

export default blogSlice.reducer;