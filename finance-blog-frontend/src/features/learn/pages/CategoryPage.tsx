// src/features/learn/pages/CategoryPage.tsx

import { useParams, useNavigate } from 'react-router-dom';
import { getCategoryBySlug, getProductsByCategory } from '../utils/learnData.utils';
import Button from '../../../components/common/Button';
import styles from './CategoryPage.module.css';

const CategoryPage = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const navigate = useNavigate();

  const category = categorySlug ? getCategoryBySlug(categorySlug) : undefined;
  const products = category ? getProductsByCategory(category.id) : [];

  if (!category) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.notFound}>
            <h1>Category not found</h1>
            <p>The category you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/learn')}>Back to Learn</Button>
          </div>
        </div>
      </div>
    );
  }

  const handleProductClick = (productSlug: string) => {
    navigate(`/learn/${categorySlug}/${productSlug}`);
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb}>
          <button onClick={() => navigate('/learn')} className={styles.breadcrumbLink}>
            Learn
          </button>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>{category.title}</span>
        </nav>

        {/* Header */}
        <header className={styles.header}>
          <div className={styles.categoryIcon}>{category.icon}</div>
          <h1 className={styles.title}>{category.title}</h1>
          <p className={styles.description}>{category.description}</p>
        </header>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className={styles.empty}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            <h2>No products yet</h2>
            <p className={styles.emptyText}>
              Content is being added. Check back soon!
            </p>
          </div>
        ) : (
          <div className={styles.grid}>
            {products.map((product) => (
              <button
                key={product.id}
                className={styles.card}
                onClick={() => handleProductClick(product.slug)}
              >
                <div className={styles.cardNumber}>{product.order}</div>
                <h3 className={styles.cardTitle}>{product.title}</h3>
                <p className={styles.cardDescription}>{product.description}</p>
                <div className={styles.cardFooter}>
                  <span className={styles.cardAction}>
                    Start Learning
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;