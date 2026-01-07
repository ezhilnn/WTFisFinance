import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store';
import { fetchBlogBySlugRequest, clearCurrentBlog } from '../store/blog.slice';
import { recordView, recordEngagedRead } from '../services/blog.service';
import { setDocumentTitle, setMetaTags, generateBlogJsonLd } from '../../../utils/seo';
import BlogReader from '../components/BlogReader';
import { BlogDetailSkeleton } from '../../../components/skeletons';
import Button from '../../../components/common/Button';
import { useAuth } from '../../auth/hooks/useAuth';
import { VIEW_TRACKING } from '../../../config/constants';
import styles from './BlogDetailPage.module.css';
import CommentList from '../../comments/components/CommentList';
import { useViewTracking } from '../../views/useViewTracking';
import LikeButton from '../../likes/components/LikeButton';

const BlogDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentBlog, isLoading } = useAppSelector((state) => state.blogs);
  const [hasRecordedView, setHasRecordedView] = useState(false);

  useEffect(() => {
    if (slug) {
      dispatch(fetchBlogBySlugRequest({ slug }));
    }

    return () => {
      dispatch(clearCurrentBlog());
    };
  }, [slug, dispatch]);
useViewTracking({ blogId: currentBlog?.id || '', enabled: !!currentBlog });

  // Record view and engaged read
  useEffect(() => {
    if (currentBlog && !hasRecordedView) {
      // Record view
      recordView(currentBlog.id).catch(console.error);
      setHasRecordedView(true);

      // Record engaged read after threshold
      const timer = setTimeout(() => {
        recordEngagedRead(currentBlog.id).catch(console.error);
      }, VIEW_TRACKING.ENGAGED_READ_THRESHOLD);

      return () => clearTimeout(timer);
    }
  }, [currentBlog, hasRecordedView]);

  // Set SEO meta tags
  useEffect(() => {
    if (currentBlog) {
      setDocumentTitle(currentBlog.title);
      setMetaTags({
        title: currentBlog.title,
        description: currentBlog.excerpt,
        keywords: currentBlog.tags.join(', '),
        ogUrl: window.location.href,
      });
      generateBlogJsonLd({
        title: currentBlog.title,
        description: currentBlog.excerpt,
        author: currentBlog.authorName,
        datePublished: currentBlog.publishedAt || currentBlog.createdAt,
        dateModified: currentBlog.updatedAt,
        url: window.location.href,
      });
    }
  }, [currentBlog]);

  if (isLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <BlogDetailSkeleton />
        </div>
      </div>
    );
  }

  if (!currentBlog) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.notFound}>
            <h1>Blog not found</h1>
            <p>The blog you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/blogs')}>Browse All Blogs</Button>
          </div>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(
    currentBlog.publishedAt || currentBlog.createdAt
  ).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className={styles.page}>
      <article className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          {/* Tags */}
          {currentBlog.tags.length > 0 && (
            <div className={styles.tags}>
              {currentBlog.tags.map((tagId, index) => (
                <span key={index} className={styles.tag}>
                  {tagId}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className={styles.title}>{currentBlog.title}</h1>

          {/* Meta */}
          <div className={styles.meta}>
            <span className={styles.metaItem}>
              By {currentBlog.authorName}
            </span>
            <span className={styles.metaDivider}>•</span>
            <span className={styles.metaItem}>{formattedDate}</span>
            <span className={styles.metaDivider}>•</span>
            <span className={styles.metaItem}>
              {currentBlog.readTime} min read
            </span>
            <span className={styles.metaDivider}>•</span>
            <span className={styles.metaItem}>
              {currentBlog.views} views
            </span>
            <span className={styles.metaDivider}>•</span>
            <LikeButton 
              targetId={currentBlog.id} 
              targetType="blog" 
              initialCount={currentBlog.likesCount}
              size="small"
            />
          </div>

          {/* Admin actions */}
          {user?.role === 'admin' && (
            <div className={styles.adminActions}>
              <Button
                variant="secondary"
                size="small"
                onClick={() => navigate(`/admin/edit-blog/${currentBlog.slug}`)}
              >
                Edit Blog
              </Button>
            </div>
          )}
        </header>

        {/* Content */}
        <div className={styles.content}>
          <BlogReader content={currentBlog.content} />
        </div>

        {/* Footer disclaimer */}
        <footer className={styles.footer}>
          <p className={styles.disclaimer}>
            This content is for educational purposes only and does not constitute
            investment advice. The author is not a SEBI-registered investment advisor.
          </p>
        </footer>
         <CommentList blogId={currentBlog.id} />
      </article>
    </div>
  );
};

export default BlogDetailPage;