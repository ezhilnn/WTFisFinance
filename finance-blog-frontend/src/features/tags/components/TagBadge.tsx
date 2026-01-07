// src/features/tags/components/TagBadge.tsx

import { useAppDispatch } from '../../../store';
import { selectTag } from '../store/tag.slice';
import styles from './TagBadge.module.css';

interface TagBadgeProps {
  tagId: string;
  tagName: string;
  clickable?: boolean;
  size?: 'small' | 'medium';
}

const TagBadge = ({ tagId, tagName, clickable = false, size = 'small' }: TagBadgeProps) => {
  const dispatch = useAppDispatch();

  const handleClick = () => {
    if (clickable) {
      dispatch(selectTag({ tagId }));
    }
  };

  return (
    <span
      className={`${styles.badge} ${styles[size]} ${clickable ? styles.clickable : ''}`}
      onClick={clickable ? handleClick : undefined}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
    >
      {tagName}
    </span>
  );
};

export default TagBadge;