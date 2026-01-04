import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { type TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import rootReducer, { type RootState } from './rootReducer';
import rootSaga from './rootSaga';

/**
 * Redux Store Configuration
 * - Redux Toolkit for state management
 * - Redux Saga for side effects
 */

// Create saga middleware
const sagaMiddleware = createSagaMiddleware();

// Configure store
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Disable serializable check for sagas
      serializableCheck: false,
    }).concat(sagaMiddleware),
  devTools: import.meta.env.DEV, // Enable Redux DevTools in development
});

// Run root saga
sagaMiddleware.run(rootSaga);

// Export types
export type AppDispatch = typeof store.dispatch;

// Export typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;