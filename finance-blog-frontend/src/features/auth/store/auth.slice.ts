import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, User, LoginPayload, SignUpPayload, GoogleSignInPayload } from '../types/auth.types';

/**
 * Auth Slice
 * Manages authentication state
 */

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isInitialized: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Login actions
    loginRequest: (state, _action: PayloadAction<LoginPayload>) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = action.payload;
    },

    // Sign up actions
    signUpRequest: (state, _action: PayloadAction<SignUpPayload>) => {
      state.isLoading = true;
      state.error = null;
    },
    signUpSuccess: (state, action: PayloadAction<User>) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
    },
    signUpFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = action.payload;
    },

    // Google sign in actions
    googleSignInRequest: (state, _action: PayloadAction<GoogleSignInPayload>) => {
      state.isLoading = true;
      state.error = null;
    },
    googleSignInSuccess: (state, action: PayloadAction<User>) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
    },
    googleSignInFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = action.payload;
    },

    // Logout actions
    logoutRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    logoutSuccess: (state) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
    },
    logoutFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Initialize auth state (from Firebase onAuthStateChanged)
    initializeAuth: (state) => {
      state.isLoading = true;
    },
    setAuthUser: (state, action: PayloadAction<User | null>) => {
      state.isLoading = false;
      state.isInitialized = true;
      state.user = action.payload;
      state.isAuthenticated = action.payload !== null;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  loginRequest,
  loginSuccess,
  loginFailure,
  signUpRequest,
  signUpSuccess,
  signUpFailure,
  googleSignInRequest,
  googleSignInSuccess,
  googleSignInFailure,
  logoutRequest,
  logoutSuccess,
  logoutFailure,
  initializeAuth,
  setAuthUser,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;