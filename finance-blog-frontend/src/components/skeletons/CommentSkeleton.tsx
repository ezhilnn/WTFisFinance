import styles from './CommentSkeleton.module.css';
import skeletonStyles from './Skeleton.module.css';

interface CommentSkeletonProps {
  count?: number;
}

const CommentSkeleton = ({ count = 3 }: CommentSkeletonProps) => {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <div key={i} className={styles.comment}>
          {/* Avatar and name */}
          <div className={styles.header}>
            <div className={`${skeletonStyles.skeleton} ${skeletonStyles.circle} ${styles.avatar}`}></div>
            <div className={styles.info}>
              <div className={`${skeletonStyles.skeleton} ${styles.name}`}></div>
              <div className={`${skeletonStyles.skeleton} ${styles.date}`}></div>
            </div>
          </div>

          {/* Comment content */}
          <div className={styles.content}>
            <div className={`${skeletonStyles.skeleton} ${styles.line}`}></div>
            <div className={`${skeletonStyles.skeleton} ${styles.line}`}></div>
            <div className={`${skeletonStyles.skeleton} ${styles.lineShort}`}></div>
          </div>

          {/* Actions */}
          <div className={styles.actions}>
            <div className={`${skeletonStyles.skeleton} ${styles.action}`}></div>
            <div className={`${skeletonStyles.skeleton} ${styles.action}`}></div>
          </div>
        </div>
      ))}
    </>
  );
};

export default CommentSkeleton;