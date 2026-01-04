import type { UserRole } from '../../../types/common.types';

// User from backend
export interface User {
  uid: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

// Auth state
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean; // Firebase auth state loaded
}

// Login credentials
export interface LoginCredentials {
  email: string;
  password: string;
}

// Signup credentials
export interface SignUpCredentials {
  email: string;
  password: string;
}

// Auth action payloads
export interface LoginPayload {
  credentials: LoginCredentials;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export interface SignUpPayload {
  credentials: SignUpCredentials;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export interface GoogleSignInPayload {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}