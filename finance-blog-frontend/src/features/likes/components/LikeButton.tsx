// src/features/likes/components/LikeButton.tsx

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  toggleLikeRequest,
  checkLikeStatusRequest,
  setLikeCount,
} from '../store/like.slice';
import styles from './LikeButton.module.css';

interface LikeButtonProps {
  targetId: string;
  targetType: 'blog' | 'comment';
  initialCount?: number;
  showCount?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const LikeButton = ({
  targetId,
  targetType,
  initialCount = 0,
  showCount = true,
  size = 'medium',
}: LikeButtonProps) => {
  const dispatch = useAppDispatch();
  const { likedBlogs, likeCounts, isLoading } = useAppSelector((state) => state.likes);

  const isLiked = likedBlogs[targetId] || false;
  const count = likeCounts[targetId] ?? initialCount;
  const loading = isLoading[targetId] || false;

  // Check like status on mount
  useEffect(() => {
    dispatch(checkLikeStatusRequest({ targetId }));
    
    // Set initial count
    if (initialCount !== undefined) {
      dispatch(setLikeCount({ targetId, count: initialCount }));
    }
  }, [targetId, initialCount, dispatch]);

  const handleToggleLike = () => {
    if (loading) return;

    dispatch(
      toggleLikeRequest({
        targetId,
        targetType,
      })
    );
  };

  return (
    <button
      onClick={handleToggleLike}
      disabled={loading}
      className={`${styles.button} ${styles[size]} ${isLiked ? styles.liked : ''}`}
      aria-label={isLiked ? 'Unlike' : 'Like'}
    >
      {/* Thumbs up icon */}
      <svg
        width={size === 'small' ? '16' : size === 'large' ? '24' : '20'}
        height={size === 'small' ? '16' : size === 'large' ? '24' : '20'}
        viewBox="0 0 24 24"
        fill={isLiked ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={styles.icon}
      >
        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
      </svg>

      {showCount && <span className={styles.count}>{count}</span>}
    </button>
  );
};

export default LikeButton;