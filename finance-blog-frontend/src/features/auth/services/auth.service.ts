import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  type User as FirebaseUser,
} from 'firebase/auth';
import { auth } from '../../../config/firebase';
import { api } from '../../../services/api';
import type { User } from '../types/auth.types';

/**
 * Auth Service
 * Handles Firebase authentication and backend sync
 */

// Sign up with email/password
export const signUpWithEmail = async (
  email: string,
  password: string
): Promise<{ firebaseUser: FirebaseUser; backendUser: User }> => {
  // Create user in Firebase Auth
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const firebaseUser = userCredential.user;

  // Get Firebase ID token
  const idToken = await firebaseUser.getIdToken();

  // Sync with backend (creates user in database)
  const response = await api.post<User>('/users/sync');

  if (!response.success || !response.data) {
    throw new Error('Failed to sync user with backend');
  }

  return {
    firebaseUser,
    backendUser: response.data,
  };
};

// Sign in with email/password
export const signInWithEmail = async (
  email: string,
  password: string
): Promise<{ firebaseUser: FirebaseUser; backendUser: User }> => {
  // Sign in with Firebase Auth
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const firebaseUser = userCredential.user;

  // Get Firebase ID token
  const idToken = await firebaseUser.getIdToken();

  // Sync with backend (updates last login)
  const response = await api.post<User>('/users/sync');

  if (!response.success || !response.data) {
    throw new Error('Failed to sync user with backend');
  }

  return {
    firebaseUser,
    backendUser: response.data,
  };
};

// Sign in with Google
export const signInWithGoogle = async (): Promise<{
  firebaseUser: FirebaseUser;
  backendUser: User;
}> => {
  const provider = new GoogleAuthProvider();

  // Sign in with Google popup
  const userCredential = await signInWithPopup(auth, provider);
  const firebaseUser = userCredential.user;

  // Get Firebase ID token
  const idToken = await firebaseUser.getIdToken();

  // Sync with backend
  const response = await api.post<User>('/users/sync');

  if (!response.success || !response.data) {
    throw new Error('Failed to sync user with backend');
  }

  return {
    firebaseUser,
    backendUser: response.data,
  };
};

// Sign out
export const signOut = async (): Promise<void> => {
  await firebaseSignOut(auth);
};

// Get current user from backend
export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<User>('/users/me');

  if (!response.success || !response.data) {
    throw new Error('Failed to get current user');
  }

  return response.data;
};