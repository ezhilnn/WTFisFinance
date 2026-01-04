import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store';
import { createBlogRequest, fetchTagsRequest } from '../store/blog.slice';
import BlogEditor from '../components/BlogEditor';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import { useToast } from '../../../hooks/useToast';
import styles from './CreateBlogPage.module.css';

const CreateBlogPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const { tags, isLoading } = useAppSelector((state) => state.blogs);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [published, setPublished] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; content?: string }>({});

  useEffect(() => {
    dispatch(fetchTagsRequest());
  }, [dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    const newErrors: { title?: string; content?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!content.trim() || content === '<p></p>') {
      newErrors.content = 'Content is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    // Create blog
    dispatch(
      createBlogRequest({
        data: {
          title: title.trim(),
          content: JSON.parse(content), // TipTap stores as HTML, we need JSON
          tags: selectedTags,
          published,
        },
        onSuccess: (blog) => {
          toast.success(
            published ? 'Blog published successfully!' : 'Blog saved as draft!'
          );
          navigate(`/blogs/${blog.slug}`);
        },
        onError: (error) => {
          toast.error(error);
        },
      })
    );
  };

  const handleAddTag = () => {
    if (newTag.trim() && !selectedTags.includes(newTag.trim())) {
      setSelectedTags([...selectedTags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Write New Blog</h1>
          <Button variant="ghost" onClick={() => navigate(-1)}>
            Cancel
          </Button>
        </header>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Title */}
          <Input
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter blog title..."
            error={errors.title}
            fullWidth
          />

          {/* Content Editor */}
          <div className={styles.editorWrapper}>
            <label className={styles.label}>Content</label>
            <BlogEditor
              content={content}
              onChange={setContent}
              placeholder="Start writing your blog..."
            />
            {errors.content && (
              <span className={styles.error}>{errors.content}</span>
            )}
          </div>

          {/* Tags */}
          <div className={styles.tagsSection}>
            <label className={styles.label}>Tags</label>
            
            {/* Selected tags */}
            {selectedTags.length > 0 && (
              <div className={styles.selectedTags}>
                {selectedTags.map((tag) => (
                  <span key={tag} className={styles.selectedTag}>
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className={styles.removeTag}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Add new tag */}
            <div className={styles.addTag}>
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag..."
              />
              <Button
                type="button"
                variant="secondary"
                onClick={handleAddTag}
                disabled={!newTag.trim()}
              >
                Add Tag
              </Button>
            </div>

            {/* Existing tags */}
            {tags.length > 0 && (
              <div className={styles.existingTags}>
                <p className={styles.existingTagsLabel}>Or select from existing:</p>
                <div className={styles.tagsList}>
                  {tags.map((tag) => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => {
                        if (!selectedTags.includes(tag.name)) {
                          setSelectedTags([...selectedTags, tag.name]);
                        }
                      }}
                      className={styles.existingTag}
                      disabled={selectedTags.includes(tag.name)}
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Publish checkbox */}
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
            />
            <span>Publish immediately (uncheck to save as draft)</span>
          </label>

          {/* Actions */}
          <div className={styles.actions}>
            <Button
              type="submit"
              variant="primary"
              size="large"
              isLoading={isLoading}
            >
              {published ? 'Publish Blog' : 'Save Draft'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBlogPage;