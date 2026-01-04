import styles from './BlogDetailSkeleton.module.css';
import skeletonStyles from './Skeleton.module.css';

const BlogDetailSkeleton = () => {
  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        {/* Tags */}
        <div className={styles.tags}>
          <div className={`${skeletonStyles.skeleton} ${styles.tag}`}></div>
          <div className={`${skeletonStyles.skeleton} ${styles.tag}`}></div>
          <div className={`${skeletonStyles.skeleton} ${styles.tag}`}></div>
        </div>

        {/* Title */}
        <div className={`${skeletonStyles.skeleton} ${styles.title}`}></div>
        <div className={`${skeletonStyles.skeleton} ${styles.titleLine2}`}></div>

        {/* Meta */}
        <div className={styles.meta}>
          <div className={`${skeletonStyles.skeleton} ${styles.metaItem}`}></div>
          <div className={`${skeletonStyles.skeleton} ${styles.metaItem}`}></div>
          <div className={`${skeletonStyles.skeleton} ${styles.metaItem}`}></div>
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {/* Paragraphs */}
        {[...Array(5)].map((_, i) => (
          <div key={i} className={styles.paragraph}>
            <div className={`${skeletonStyles.skeleton} ${styles.line}`}></div>
            <div className={`${skeletonStyles.skeleton} ${styles.line}`}></div>
            <div className={`${skeletonStyles.skeleton} ${styles.line}`}></div>
            <div className={`${skeletonStyles.skeleton} ${styles.lineShort}`}></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogDetailSkeleton;