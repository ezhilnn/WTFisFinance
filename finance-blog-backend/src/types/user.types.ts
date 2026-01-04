import { TimestampFields } from './common.types';

// User roles
export type UserRole = 'admin' | 'user';

// User document structure in Firestore (MINIMAL)
export interface User extends TimestampFields {
  uid: string; // Firebase Auth UID
  email: string; // Unique - no duplicates allowed
  role: UserRole; // admin or user
}

// Request to create user
export interface CreateUserRequest {
  uid: string;
  email: string;
}

// Public user info (for display)
export interface PublicUserInfo {
  uid: string;
  email: string;
  role: UserRole;
}