import { all, fork } from 'redux-saga/effects';
import authSaga from '../features/auth/store/auth.saga';
import blogSaga from '../features/blogs/store/blog.saga';
import commentSaga from '../features/comments/store/comment.saga'; // Add this
import likeSaga from '../features/likes/store/like.saga'; // Add this
import tagSaga from '../features/tags/store/tag.saga';



/**
 * Root Saga
 * Combines all feature sagas
 */

export default function* rootSaga() {
  yield all([
    fork(authSaga),
    fork(blogSaga),
    fork(commentSaga),
    fork(likeSaga),
    fork(tagSaga),
  ]);
}