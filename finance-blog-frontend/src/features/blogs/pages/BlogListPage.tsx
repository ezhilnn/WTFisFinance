// src/features/blogs/pages/BlogListPage.tsx

import { useEffect, useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import { fetchBlogsRequest } from '../store/blog.slice';
import BlogCard from '../components/BlogCard';
import { BlogCardSkeleton } from '../../../components/skeletons';
import Button from '../../../components/common/Button';
import SearchBar from '../../../components/common/SearchBar';
import TagList from '../../tags/components/TagList';
import styles from './BlogListPage.module.css';

const BlogListPage = () => {
  const dispatch = useAppDispatch();
  const { blogs = [], isLoading, pagination } = useAppSelector((state) => state.blogs);
  const { selectedTag, tags } = useAppSelector((state) => state.tags);
  
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchBlogsRequest({ page: 1, limit: 10 }));
  }, [dispatch]);

  // Filter blogs based on search and tag
  const filteredBlogs = useMemo(() => {
    let filtered = [...blogs];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((blog) => {
        const titleMatch = blog.title.toLowerCase().includes(query);
        const excerptMatch = typeof blog.excerpt === 'string' && blog.excerpt.toLowerCase().includes(query);
        const contentMatch = JSON.stringify(blog.content).toLowerCase().includes(query);
        return titleMatch || excerptMatch || contentMatch;
      });
    }

    // Filter by selected tag
    if (selectedTag) {
      filtered = filtered.filter((blog) => blog.tags.includes(selectedTag));
    }

    return filtered;
  }, [blogs, searchQuery, selectedTag]);

  const handleLoadMore = () => {
    if (pagination && pagination.page < pagination.totalPages) {
      dispatch(fetchBlogsRequest({ page: pagination.page + 1, limit: 10 }));
    }
  };

  const selectedTagName = tags.find((t) => t.id === selectedTag)?.name;

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

        {/* Search Bar */}
        <div className={styles.searchSection}>
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search blogs by title or content..."
          />
        </div>

        {/* Tag Filter */}
        <TagList />

        {/* Active filters indicator */}
        {(searchQuery || selectedTag) && (
          <div className={styles.activeFilters}>
            <span className={styles.filterText}>
              {searchQuery && `Searching for "${searchQuery}"`}
              {searchQuery && selectedTag && ' in '}
              {selectedTag && `"${selectedTagName}"`}
            </span>
            <span className={styles.resultCount}>
              {filteredBlogs.length} {filteredBlogs.length === 1 ? 'result' : 'results'}
            </span>
          </div>
        )}

        {/* Blog grid */}
        <div className={styles.grid}>
          {isLoading && blogs.length === 0 ? (
            // Initial loading
            <>
              {[...Array(6)].map((_, i) => (
                <BlogCardSkeleton key={i} />
              ))}
            </>
          ) : filteredBlogs.length === 0 ? (
            // No blogs found
            <div className={styles.empty}>
              {searchQuery || selectedTag ? (
                <>
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                  <h2>No blogs found</h2>
                  <p className={styles.emptyText}>
                    We couldn't find any blogs matching your search criteria.
                  </p>
                  <p className={styles.emptyHint}>
                    Try different keywords or clear the filters to see all blogs.
                  </p>
                </>
              ) : (
                <>
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  <h2>No blogs yet</h2>
                  <p className={styles.emptyText}>Check back soon for new content!</p>
                </>
              )}
            </div>
          ) : (
            // Blogs list
            <>
              {filteredBlogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </>
          )}
        </div>

        {/* Pagination - only show if not filtering */}
        {!searchQuery && !selectedTag && pagination && pagination.page < pagination.totalPages && (
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