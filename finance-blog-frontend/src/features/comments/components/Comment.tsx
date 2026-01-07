// src/features/comments/components/Comment.tsx

import { useState } from 'react';
import { useAppDispatch } from '../../../store';
import { deleteCommentRequest, setReplyingTo } from '../store/comment.slice';
import { useAuth } from '../../auth/hooks/useAuth';
import { useToast } from '../../../hooks/useToast';
import CommentForm from './CommentForm';
import Button from '../../../components/common/Button';
import type { Comment as CommentType } from '../types/comment.types';
import styles from './Comment.module.css';

interface CommentProps {
  comment: CommentType;
  replies: CommentType[];
  isReplyingTo: boolean;
}

const Comment = ({ comment, replies, isReplyingTo }: CommentProps) => {
  const dispatch = useAppDispatch();
  const toast = useToast();
  const { user } = useAuth();
  
  const [showReplies, setShowReplies] = useState(false);

  const formattedDate = new Date(comment.createdAt).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleReply = () => {
    dispatch(setReplyingTo({ commentId: comment.id }));
  };

  const handleCancelReply = () => {
    dispatch(setReplyingTo({ commentId: null }));
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      dispatch(
        deleteCommentRequest({
          id: comment.id,
          blogId: comment.blogId,
          onSuccess: () => {
            toast.success('Comment deleted successfully');
          },
          onError: (error) => {
            toast.error(error);
          },
        })
      );
    }
  };

  return (
    <div className={styles.comment}>
      <div className={styles.avatar}>
        <div className={styles.avatarCircle}>
          {comment.user.name.charAt(0).toUpperCase()}
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <span className={styles.name}>{comment.user.name}</span>
          <span className={styles.dot}>•</span>
          <span className={styles.date}>{formattedDate}</span>
        </div>

        <p className={styles.text}>{comment.content}</p>

        <div className={styles.actions}>
          <button className={styles.actionButton} onClick={handleReply}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
            Reply
          </button>

          {replies.length > 0 && (
            <button
              className={styles.actionButton}
              onClick={() => setShowReplies(!showReplies)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points={showReplies ? "18 15 12 9 6 15" : "6 9 12 15 18 9"} />
              </svg>
              {replies.length} {replies.length === 1 ? 'Reply' : 'Replies'}
            </button>
          )}

          {user?.role === 'admin' && (
            <button className={`${styles.actionButton} ${styles.deleteButton}`} onClick={handleDelete}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
              Delete
            </button>
          )}
        </div>

        {/* Reply form */}
        {isReplyingTo && (
          <div className={styles.replyForm}>
            <CommentForm
              blogId={comment.blogId}
              parentId={comment.id}
              onCancel={handleCancelReply}
            />
          </div>
        )}

        {/* Replies */}
        {showReplies && replies.length > 0 && (
          <div className={styles.replies}>
            {replies.map((reply) => (
              <Comment
                key={reply.id}
                comment={reply}
                replies={[]}
                isReplyingTo={false}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Comment;