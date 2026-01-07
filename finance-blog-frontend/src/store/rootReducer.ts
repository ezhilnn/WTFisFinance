import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/store/auth.slice';
import blogReducer from '../features/blogs/store/blog.slice';
import commentReducer from '../features/comments/store/comment.slice'; // Add this
import likeReducer from '../features/likes/store/like.slice';
import tagReducer from '../features/tags/store/tag.slice'; // Add this




/**
 * Root Reducer
 * Combines all feature reducers
 */

const rootReducer = combineReducers({
  auth: authReducer,
  blogs: blogReducer,
  comments: commentReducer,
  likes:likeReducer,
  tags : tagReducer
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;