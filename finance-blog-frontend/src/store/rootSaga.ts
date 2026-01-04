import { all, fork } from 'redux-saga/effects';
import authSaga from '../features/auth/store/auth.saga';
import blogSaga from '../features/blogs/store/blog.saga';

/**
 * Root Saga
 * Combines all feature sagas
 */

export default function* rootSaga() {
  yield all([
    fork(authSaga),
    fork(blogSaga),
    // fork(commentSaga),
    // fork(tagSaga),
  ]);
}