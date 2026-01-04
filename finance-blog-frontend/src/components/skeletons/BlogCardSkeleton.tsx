import styles from './BlogCardSkeleton.module.css';
import skeletonStyles from './Skeleton.module.css';

const BlogCardSkeleton = () => {
  return (
    <div className={styles.card}>
      {/* Tags */}
      <div className={styles.tags}>
        <div className={`${skeletonStyles.skeleton} ${styles.tag}`}></div>
        <div className={`${skeletonStyles.skeleton} ${styles.tag}`}></div>
      </div>

      {/* Title */}
      <div className={`${skeletonStyles.skeleton} ${styles.title}`}></div>
      <div className={`${skeletonStyles.skeleton} ${styles.titleShort}`}></div>

      {/* Excerpt */}
      <div className={styles.excerpt}>
        <div className={`${skeletonStyles.skeleton} ${styles.line}`}></div>
        <div className={`${skeletonStyles.skeleton} ${styles.line}`}></div>
        <div className={`${skeletonStyles.skeleton} ${styles.lineShort}`}></div>
      </div>

      {/* Meta info */}
      <div className={styles.meta}>
        <div className={`${skeletonStyles.skeleton} ${styles.metaItem}`}></div>
        <div className={`${skeletonStyles.skeleton} ${styles.metaItem}`}></div>
        <div className={`${skeletonStyles.skeleton} ${styles.metaItem}`}></div>
      </div>
    </div>
  );
};

export default BlogCardSkeleton;