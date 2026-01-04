import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../../config/firebase';
import { setAuthUser, initializeAuth } from '../store/auth.slice';
import { api } from '../../../services/api';
import type { User } from '../types/auth.types';

/**
 * useAuth Hook
 * Provides auth state and initializes Firebase auth listener
 */

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(initializeAuth());

    // Listen to Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // First, sync user with backend (creates if doesn't exist)
          const syncResponse = await api.post<User>('/users/sync');
          
          if (syncResponse.success && syncResponse.data) {
            dispatch(setAuthUser(syncResponse.data));
          } else {
            console.error('Failed to sync user:', syncResponse.message);
            dispatch(setAuthUser(null));
          }
        } catch (error) {
          console.error('Failed to sync user with backend:', error);
          dispatch(setAuthUser(null));
        }
      } else {
        // User is logged out
        dispatch(setAuthUser(null));
      }
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [dispatch]);

  return authState;
};