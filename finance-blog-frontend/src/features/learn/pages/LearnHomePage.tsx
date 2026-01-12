// src/features/learn/pages/LearnHomePage.tsx

import { useNavigate } from 'react-router-dom';
import categories from '../../../data/learn/categories.json';
import styles from './LearnHomePage.module.css';

const LearnHomePage = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categorySlug: string) => {
    navigate(`/learn/${categorySlug}`);
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <h1 className={styles.title}>Learn Finance</h1>
          <p className={styles.subtitle}>
            Master financial concepts through structured, jargon-free lessons
          </p>
        </header>

        {/* Categories Grid */}
        <div className={styles.grid}>
          {categories.map((category) => (
            <button
              key={category.id}
              className={styles.card}
              onClick={() => handleCategoryClick(category.slug)}
            >
              <div className={styles.cardIcon}>{category.icon}</div>
              <h3 className={styles.cardTitle}>{category.title}</h3>
              <p className={styles.cardDescription}>{category.description}</p>
              <div className={styles.cardArrow}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LearnHomePage;