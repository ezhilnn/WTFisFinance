// src/features/learn/pages/ProductPage.tsx

import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { getCategoryBySlug, getProductWithContent } from '../utils/learnData.utils';
import { useLearnViewTracking } from '../hooks/useLearnViewTracking';
import Button from '../../../components/common/Button';
import LessonContent from '../components/LessonContent';
import QuizSection from '../components/QuizSection';
import styles from './ProductPage.module.css';
import type { ProductWithContent, SubAnchorWithLessons } from '../types/learn.types';

const ProductPage = () => {
  const { categorySlug, productSlug } = useParams<{ categorySlug: string; productSlug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [productWithContent, setProductWithContent] = useState<ProductWithContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSubAnchorId, setActiveSubAnchorId] = useState<string | null>(null);
  const [expandedAnchors, setExpandedAnchors] = useState<Set<string>>(new Set());
  const contentRef = useRef<HTMLDivElement>(null);

  const category = categorySlug ? getCategoryBySlug(categorySlug) : undefined;

  // View tracking
  useLearnViewTracking({
    categorySlug,
    productSlug,
    subAnchorId: activeSubAnchorId || undefined,
    enabled: !!productWithContent,
  });

  // Flatten all sub-anchors in order for navigation
  const allSubAnchors: SubAnchorWithLessons[] = productWithContent
    ? productWithContent.anchorsWithContent
        .sort((a, b) => a.order - b.order)
        .flatMap((anchor) =>
          anchor.subAnchorsWithLessons.sort((a, b) => a.order - b.order)
        )
    : [];

  const currentIndex = allSubAnchors.findIndex((sa) => sa.id === activeSubAnchorId);
  const isFirstSubAnchor = currentIndex === 0;
  const isLastSubAnchor = currentIndex === allSubAnchors.length - 1;

  useEffect(() => {
    const loadProduct = async () => {
      if (!categorySlug || !productSlug) return;

      setIsLoading(true);
      try {
        const data = await getProductWithContent(categorySlug, productSlug);
        setProductWithContent(data || null);

        if (data && data.anchorsWithContent.length > 0) {
          // Get first sub-anchor
          const firstAnchor = data.anchorsWithContent.sort((a, b) => a.order - b.order)[0];
          const firstSubAnchor = firstAnchor.subAnchorsWithLessons.sort((a, b) => a.order - b.order)[0];

          if (firstSubAnchor) {
            // Check URL hash
            const hash = location.hash.replace('#', '');
            const targetSubAnchor = data.anchorsWithContent
              .flatMap((a) => a.subAnchorsWithLessons)
              .find((sa) => sa.id === hash);

            const initialSubAnchor = targetSubAnchor || firstSubAnchor;
            setActiveSubAnchorId(initialSubAnchor.id);

            // Expand the anchor containing this sub-anchor
            const parentAnchor = data.anchorsWithContent.find((a) =>
              a.subAnchorsWithLessons.some((sa) => sa.id === initialSubAnchor.id)
            );
            if (parentAnchor) {
              setExpandedAnchors(new Set([parentAnchor.id]));
            }
          }
        }
      } catch (error) {
        console.error('Error loading product:', error);
        setProductWithContent(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [categorySlug, productSlug]);

  // Update hash when active changes
  useEffect(() => {
    if (activeSubAnchorId) {
      navigate(`#${activeSubAnchorId}`, { replace: true });
      // Scroll to top of content
      contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [activeSubAnchorId, navigate]);

  if (isLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.loading}>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!category || !productWithContent) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.notFound}>
            <h1>Product not found</h1>
            <p>The product you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/learn')}>Back to Learn</Button>
          </div>
        </div>
      </div>
    );
  }

  const toggleAnchor = (anchorId: string) => {
    const newExpanded = new Set(expandedAnchors);
    if (newExpanded.has(anchorId)) {
      newExpanded.delete(anchorId);
    } else {
      newExpanded.add(anchorId);
    }
    setExpandedAnchors(newExpanded);
  };

  const handleSubAnchorClick = (subAnchorId: string, anchorId: string) => {
    setActiveSubAnchorId(subAnchorId);
    // Auto-expand parent anchor
    setExpandedAnchors((prev) => new Set([...prev, anchorId]));
  };

  const handleNext = () => {
    if (currentIndex < allSubAnchors.length - 1) {
      const nextSubAnchor = allSubAnchors[currentIndex + 1];
      const parentAnchor = productWithContent.anchorsWithContent.find((a) =>
        a.subAnchorsWithLessons.some((sa) => sa.id === nextSubAnchor.id)
      );
      if (parentAnchor) {
        handleSubAnchorClick(nextSubAnchor.id, parentAnchor.id);
      }
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevSubAnchor = allSubAnchors[currentIndex - 1];
      const parentAnchor = productWithContent.anchorsWithContent.find((a) =>
        a.subAnchorsWithLessons.some((sa) => sa.id === prevSubAnchor.id)
      );
      if (parentAnchor) {
        handleSubAnchorClick(prevSubAnchor.id, parentAnchor.id);
      }
    }
  };

  const activeSubAnchor = allSubAnchors.find((sa) => sa.id === activeSubAnchorId);
  const hasContent = productWithContent.anchorsWithContent.some(
    (anchor) => anchor.subAnchorsWithLessons.some((sa) => sa.lessons.length > 0)
  );

  const showQuiz = isLastSubAnchor && productWithContent.quiz;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb}>
          <button onClick={() => navigate('/learn')} className={styles.breadcrumbLink}>
            Learn
          </button>
          <span className={styles.breadcrumbSeparator}>/</span>
          <button onClick={() => navigate(`/learn/${categorySlug}`)} className={styles.breadcrumbLink}>
            {category.title}
          </button>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>{productWithContent.title}</span>
        </nav>

        {/* Header */}
        <header className={styles.header}>
          <h1 className={styles.title}>{productWithContent.title}</h1>
          <p className={styles.description}>{productWithContent.description}</p>
        </header>

        {hasContent ? (
          <div className={styles.layout}>
            {/* Expandable Sidebar */}
            <aside className={styles.sidebar}>
              <div className={styles.sidebarSticky}>
                <h3 className={styles.sidebarTitle}>Topics</h3>
                <nav className={styles.anchorNav}>
                  {productWithContent.anchorsWithContent.map((anchor) => {
                    const isExpanded = expandedAnchors.has(anchor.id);
                    const hasLessons = anchor.subAnchorsWithLessons.some((sa) => sa.lessons.length > 0);

                    if (!hasLessons) return null;

                    return (
                      <div key={anchor.id} className={styles.anchorGroup}>
                        <button
                          className={`${styles.anchorButton} ${isExpanded ? styles.anchorButtonExpanded : ''}`}
                          onClick={() => toggleAnchor(anchor.id)}
                        >
                          <span className={styles.anchorTitle}>{anchor.title}</span>
                          <svg
                            className={`${styles.anchorIcon} ${isExpanded ? styles.anchorIconExpanded : ''}`}
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M6 9l6 6 6-6" />
                          </svg>
                        </button>

                        {isExpanded && (
                          <div className={styles.subAnchorList}>
                            {anchor.subAnchorsWithLessons.map((subAnchor) => {
                              if (subAnchor.lessons.length === 0) return null;
                              const isActive = activeSubAnchorId === subAnchor.id;

                              return (
                                <button
                                  key={subAnchor.id}
                                  className={`${styles.subAnchorButton} ${isActive ? styles.subAnchorButtonActive : ''}`}
                                  onClick={() => handleSubAnchorClick(subAnchor.id, anchor.id)}
                                >
                                  <span className={styles.subAnchorDot}></span>
                                  {subAnchor.title}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </nav>
              </div>
            </aside>

            {/* Main Content */}
            <main className={styles.content} ref={contentRef}>
              {activeSubAnchor ? (
                <>
                  {/* Sub-anchor Title */}
                  <div className={styles.contentHeader}>
                    <h2 className={styles.contentTitle}>{activeSubAnchor.title}</h2>
                  </div>

                  {/* Lessons */}
                  <div className={styles.lessons}>
                    {activeSubAnchor.lessons.map((lesson) => (
                      <LessonContent key={lesson.id} lesson={lesson} />
                    ))}
                  </div>

                  {/* Quiz (only on last sub-anchor) */}
                  {showQuiz && (
                    <div className={styles.quizWrapper}>
                      <QuizSection quiz={productWithContent.quiz!} />
                    </div>
                  )}

                  {/* Navigation */}
                  <div className={styles.navigation}>
                    <Button
                      variant="secondary"
                      onClick={handlePrevious}
                      disabled={isFirstSubAnchor}
                    >
                      ← Previous
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleNext}
                      disabled={isLastSubAnchor}
                    >
                      Next →
                    </Button>
                  </div>
                </>
              ) : (
                <div className={styles.welcome}>
                  <h2>Select a topic to start learning</h2>
                  <p>Choose from the topics on the left to begin your learning journey.</p>
                </div>
              )}
            </main>
          </div>
        ) : (
          <div className={styles.empty}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            <h2>No lessons yet</h2>
            <p className={styles.emptyText}>Content is being added. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;