import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/store/auth.slice';
import blogReducer from '../features/blogs/store/blog.slice';


/**
 * Root Reducer
 * Combines all feature reducers
 */

const rootReducer = combineReducers({
  auth: authReducer,
  blogs: blogReducer,
  // comments: commentReducer,
  // tags: tagReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;