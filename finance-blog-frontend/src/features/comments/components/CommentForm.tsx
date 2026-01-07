// src/features/comments/components/CommentForm.tsx

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import { createCommentRequest, setReplyingTo } from '../store/comment.slice';
import { useAuth } from '../../auth/hooks/useAuth';
import Button from '../../../components/common/Button';
import { useToast } from '../../../hooks/useToast';
import styles from './CommentForm.module.css';

interface CommentFormProps {
  blogId: string;
  parentId?: string;
  onCancel?: () => void;
}

const CommentForm = ({ blogId, parentId, onCancel }: CommentFormProps) => {
  const dispatch = useAppDispatch();
  const toast = useToast();
  const { user } = useAuth();
  const { isSubmitting } = useAppSelector((state) => state.comments);

  const [content, setContent] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ content?: string; name?: string; email?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: { content?: string; name?: string; email?: string } = {};

    if (!content.trim()) {
      newErrors.content = 'Comment cannot be empty';
    }

    // Only validate name/email if user is not logged in
    if (!user) {
      if (!name.trim()) {
        newErrors.name = 'Name is required';
      }
      if (!email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        newErrors.email = 'Email is invalid';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    // Get name and email
    let userName = name;
    let userEmail = email;

    if (user) {
      // Extract name from email (part before @)
      userName = user.email.split('@')[0];
      userEmail = user.email;
    }

    dispatch(
      createCommentRequest({
        data: {
          blogId,
          content: content.trim(),
          name: userName,
          email: userEmail,
          parentId,
        },
        onSuccess: () => {
          toast.success('Comment posted successfully!');
          setContent('');
          setName('');
          setEmail('');
          if (onCancel) {
            onCancel();
          }
        },
        onError: (error) => {
          toast.error(error);
        },
      })
    );
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {/* Comment textarea */}
      <div className={styles.field}>
        <label htmlFor="comment" className={styles.label}>
          {parentId ? 'Reply' : 'Leave a comment'}
        </label>
        <textarea
          id="comment"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={parentId ? 'Write your reply...' : 'Share your thoughts...'}
          className={styles.textarea}
          rows={4}
          disabled={isSubmitting}
        />
        {errors.content && <span className={styles.error}>{errors.content}</span>}
      </div>

      {/* Name and Email (only if not logged in) */}
      {!user && (
        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="name" className={styles.label}>
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className={styles.input}
              disabled={isSubmitting}
            />
            {errors.name && <span className={styles.error}>{errors.name}</span>}
          </div>

          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className={styles.input}
              disabled={isSubmitting}
            />
            {errors.email && <span className={styles.error}>{errors.email}</span>}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className={styles.actions}>
        {parentId && onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary" isLoading={isSubmitting}>
          {parentId ? 'Post Reply' : 'Post Comment'}
        </Button>
      </div>
    </form>
  );
};

export default CommentForm;