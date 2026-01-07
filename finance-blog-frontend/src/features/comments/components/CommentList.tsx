// src/features/comments/components/CommentList.tsx

import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import { fetchCommentsRequest } from '../store/comment.slice';
import Comment from './Comment';
import CommentForm from './CommentForm';
import Spinner from '../../../components/common/Spinner';
import type { Comment as CommentType } from '../types/comment.types';
import styles from './CommentList.module.css';

interface CommentListProps {
  blogId: string;
}

const CommentList = ({ blogId }: CommentListProps) => {
  const dispatch = useAppDispatch();
  const { commentsByBlog, isLoading, replyingTo } = useAppSelector((state) => state.comments);

  const comments = commentsByBlog[blogId] || [];

  useEffect(() => {
    dispatch(fetchCommentsRequest({ blogId }));
  }, [blogId, dispatch]);

  // Organize comments into parent and replies
  const { parentComments, repliesMap } = useMemo(() => {
    const parents: CommentType[] = [];
    const replies: Record<string, CommentType[]> = {};

    comments.forEach((comment) => {
      if (comment.parentId) {
        if (!replies[comment.parentId]) {
          replies[comment.parentId] = [];
        }
        replies[comment.parentId].push(comment);
      } else {
        parents.push(comment);
      }
    });

    // Sort parent comments by date (newest first)
    parents.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Sort replies by date (oldest first)
    Object.keys(replies).forEach((parentId) => {
      replies[parentId].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    });

    return { parentComments: parents, repliesMap: replies };
  }, [comments]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          Comments ({parentComments.length})
        </h2>
      </div>

      {/* Comment Form */}
      <div className={styles.formSection}>
        <CommentForm blogId={blogId} />
      </div>

      {/* Comments List */}
      {isLoading && comments.length === 0 ? (
        <div className={styles.loading}>
          <Spinner size="medium" />
        </div>
      ) : parentComments.length === 0 ? (
        <div className={styles.empty}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <p>No comments yet. Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className={styles.list}>
          {parentComments.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              replies={repliesMap[comment.id] || []}
              isReplyingTo={replyingTo === comment.id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentList;