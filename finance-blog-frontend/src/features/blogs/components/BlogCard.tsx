import { Link } from 'react-router-dom';
import type { Blog } from '../types/blog.types';
import styles from './BlogCard.module.css';

interface BlogCardProps {
  blog: Blog;
}

const BlogCard = ({ blog }: BlogCardProps) => {
  const formattedDate = new Date(blog.publishedAt || blog.createdAt).toLocaleDateString(
    'en-IN',
    {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }
  );

  // Extract plain text from content if excerpt is not a string
  const getExcerpt = (): string => {
    // Check if excerpt is valid and doesn't contain [object Object]
    if (
      typeof blog.excerpt === 'string' && 
      blog.excerpt.trim() && 
      !blog.excerpt.includes('[object Object]')
    ) {
      return blog.excerpt;
    }

    // Otherwise, try to extract from content
    if (Array.isArray(blog.content)) {
      const extractText = (content: any[]): string => {
        return content
          .map(block => {
            if (block.text) return block.text;
            if (block.content && Array.isArray(block.content)) {
              return extractText(block.content);
            }
            return '';
          })
          .join(' ')
          .trim();
      };

      const text = extractText(blog.content);
      // Return first 150 characters as excerpt
      return text.length > 150 ? text.substring(0, 150) + '...' : text;
    }

    return 'Click to read this blog post...';
  };

  const excerpt = getExcerpt();

  return (
    <Link to={`/blogs/${blog.slug}`} className={styles.card}>
      {/* Tags */}
      {blog.tags.length > 0 && (
        <div className={styles.tags}>
          {blog.tags.slice(0, 3).map((tagId, index) => (
            <span key={index} className={styles.tag}>
              {tagId}
            </span>
          ))}
        </div>
      )}

      {/* Title */}
      <h2 className={styles.title}>{blog.title}</h2>

      {/* Excerpt */}
      <p className={styles.excerpt}>{excerpt}</p>

      {/* Meta info */}
      <div className={styles.meta}>
        <span className={styles.metaItem}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          {formattedDate}
        </span>

        <span className={styles.metaItem}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          {blog.readTime} min read
        </span>

        <span className={styles.metaItem}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          {blog.views}
        </span>

        {blog.commentsCount > 0 && (
          <span className={styles.metaItem}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            {blog.commentsCount}
          </span>
        )}
      </div>

      {/* Read more indicator */}
      <div className={styles.readMore}>
        Read more →
      </div>
    </Link>
  );
};

export default BlogCard;