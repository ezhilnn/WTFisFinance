// src/features/tags/components/TagList.tsx

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import { fetchTagsRequest, selectTag, clearSelectedTag } from '../store/tag.slice';
import styles from './TagList.module.css';

const TagList = () => {
  const dispatch = useAppDispatch();
  const { tags, selectedTag, isLoading } = useAppSelector((state) => state.tags);

  useEffect(() => {
    dispatch(fetchTagsRequest({}));
  }, [dispatch]);

  const handleTagClick = (tagId: string) => {
    if (selectedTag === tagId) {
      dispatch(clearSelectedTag());
    } else {
      dispatch(selectTag({ tagId }));
    }
  };

  const handleClearAll = () => {
    dispatch(clearSelectedTag());
  };

  if (isLoading || tags.length === 0) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Filter by Topic</h3>
        {selectedTag && (
          <button onClick={handleClearAll} className={styles.clearButton}>
            Clear filter
          </button>
        )}
      </div>

      <div className={styles.tags}>
        {tags.map((tag) => (
          <button
            key={tag.id}
            onClick={() => handleTagClick(tag.id)}
            className={`${styles.tag} ${selectedTag === tag.id ? styles.active : ''}`}
          >
            <span className={styles.tagName}>{tag.name}</span>
            <span className={styles.count}>{tag.blogCount}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TagList;