import { call, put, takeLatest } from 'redux-saga/effects';
import type { PayloadAction } from '@reduxjs/toolkit';
import {
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
} from './auth.slice';
import {
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
  signOut,
} from '../services/auth.service';
import type { LoginPayload, SignUpPayload, GoogleSignInPayload, User } from '../types/auth.types';

/**
 * Auth Saga
 * Handles authentication side effects
 */

// Login saga
function* loginSaga(action: PayloadAction<LoginPayload>) {
  try {
    const { credentials, onSuccess, onError } = action.payload;

    const result: { backendUser: User } = yield call(
      signInWithEmail,
      credentials.email,
      credentials.password
    );

    yield put(loginSuccess(result.backendUser));

    if (onSuccess) {
      onSuccess();
    }
  } catch (error: any) {
    const errorMessage = error.message || 'Login failed';
    yield put(loginFailure(errorMessage));

    if (action.payload.onError) {
      action.payload.onError(errorMessage);
    }
  }
}

// Sign up saga
function* signUpSaga(action: PayloadAction<SignUpPayload>) {
  try {
    const { credentials, onSuccess, onError } = action.payload;

    const result: { backendUser: User } = yield call(
      signUpWithEmail,
      credentials.email,
      credentials.password
    );

    yield put(signUpSuccess(result.backendUser));

    if (onSuccess) {
      onSuccess();
    }
  } catch (error: any) {
    const errorMessage = error.message || 'Sign up failed';
    yield put(signUpFailure(errorMessage));

    if (action.payload.onError) {
      action.payload.onError(errorMessage);
    }
  }
}

// Google sign in saga
function* googleSignInSaga(action: PayloadAction<GoogleSignInPayload>) {
  try {
    const { onSuccess, onError } = action.payload;

    const result: { backendUser: User } = yield call(signInWithGoogle);

    yield put(googleSignInSuccess(result.backendUser));

    if (onSuccess) {
      onSuccess();
    }
  } catch (error: any) {
    const errorMessage = error.message || 'Google sign in failed';
    yield put(googleSignInFailure(errorMessage));

    if (action.payload.onError) {
      action.payload.onError(errorMessage);
    }
  }
}

// Logout saga
function* logoutSaga() {
  try {
    yield call(signOut);
    yield put(logoutSuccess());
  } catch (error: any) {
    const errorMessage = error.message || 'Logout failed';
    yield put(logoutFailure(errorMessage));
  }
}

// Root auth saga
export default function* authSaga() {
  yield takeLatest(loginRequest.type, loginSaga);
  yield takeLatest(signUpRequest.type, signUpSaga);
  yield takeLatest(googleSignInRequest.type, googleSignInSaga);
  yield takeLatest(logoutRequest.type, logoutSaga);
}