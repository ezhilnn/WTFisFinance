import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import { fetchBlogsRequest } from '../store/blog.slice';
import BlogCard from '../components/BlogCard';
import { BlogCardSkeleton } from '../../../components/skeletons';
import Button from '../../../components/common/Button';
import styles from './BlogListPage.module.css';

const BlogListPage = () => {
  const dispatch = useAppDispatch();
  const { blogs = [], isLoading, pagination } = useAppSelector((state) => state.blogs);

  useEffect(() => {
    dispatch(fetchBlogsRequest({ page: 1, limit: 10 }));
  }, [dispatch]);

  const handleLoadMore = () => {
    if (pagination && pagination.page < pagination.totalPages) {
      dispatch(fetchBlogsRequest({ page: pagination.page + 1, limit: 10 }));
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <h1 className={styles.title}>All Blogs</h1>
          <p className={styles.subtitle}>
            Educational finance content without the jargon
          </p>
        </header>

        {/* Blog grid */}
        <div className={styles.grid}>
          {isLoading && blogs.length === 0 ? (
            // Initial loading
            <>
              {[...Array(6)].map((_, i) => (
                <BlogCardSkeleton key={i} />
              ))}
            </>
          ) : blogs.length === 0 ? (
            // No blogs
            <div className={styles.empty}>
              <p>No blogs published yet. Check back soon!</p>
            </div>
          ) : (
            // Blogs list
            <>
              {blogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </>
          )}
        </div>

        {/* Pagination */}
        {pagination && pagination.page < pagination.totalPages && (
          <div className={styles.pagination}>
            <Button
              variant="secondary"
              size="large"
              onClick={handleLoadMore}
              isLoading={isLoading}
            >
              Load More
            </Button>
            <p className={styles.paginationInfo}>
              Showing {blogs.length} of {pagination.total} blogs
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogListPage;