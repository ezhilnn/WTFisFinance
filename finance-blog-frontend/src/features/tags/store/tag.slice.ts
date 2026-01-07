// src/features/tags/store/tag.slice.ts

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {
  TagState,
  Tag,
  FetchTagsPayload,
  SelectTagPayload,
} from '../types/tag.types';

const initialState: TagState = {
  tags: [],
  selectedTag: null,
  isLoading: false,
  error: null,
};

const tagSlice = createSlice({
  name: 'tags',
  initialState,
  reducers: {
    // Fetch tags
    fetchTagsRequest: (state, _action: PayloadAction<FetchTagsPayload>) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchTagsSuccess: (state, action: PayloadAction<Tag[]>) => {
      state.isLoading = false;
      state.tags = action.payload;
    },
    fetchTagsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Select tag for filtering
    selectTag: (state, action: PayloadAction<SelectTagPayload>) => {
      state.selectedTag = action.payload.tagId;
    },

    // Clear selected tag
    clearSelectedTag: (state) => {
      state.selectedTag = null;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchTagsRequest,
  fetchTagsSuccess,
  fetchTagsFailure,
  selectTag,
  clearSelectedTag,
  clearError,
} = tagSlice.actions;

export default tagSlice.reducer;