import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  updateBlogRequest,
  deleteBlogRequest,
  fetchTagsRequest,
} from '../store/blog.slice';
import { getBlogBySlug } from '../services/blog.service';
import BlogEditor from '../components/BlogEditor';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import Modal from '../../../components/common/Modal';
import Spinner from '../../../components/common/Spinner';
import { useToast } from '../../../hooks/useToast';
import styles from './CreateBlogPage.module.css'; // Reuse same styles

const EditBlogPage = () => {
  const { id } = useParams<{ id: string }>();
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
  const [isLoadingBlog, setIsLoadingBlog] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    dispatch(fetchTagsRequest());
  }, [dispatch]);

  // Load blog data
  useEffect(() => {
    const loadBlog = async () => {
      if (!id) return;

      try {
        setIsLoadingBlog(true);
        const blog = await getBlogBySlug(id);
        
        setTitle(blog.title);
        setContent(
          Array.isArray(blog.content)
            ? JSON.stringify(blog.content)
            : blog.content
        );
        setSelectedTags(blog.tags);
        setPublished(blog.published);
      } catch (error) {
        toast.error('Failed to load blog');
        navigate('/blogs');
      } finally {
        setIsLoadingBlog(false);
      }
    };

    loadBlog();
  }, [id, navigate, toast]);

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

    if (!id) return;

    // Update blog
    dispatch(
      updateBlogRequest({
        data: {
          id,
          title: title.trim(),
          content: JSON.parse(content),
          tags: selectedTags,
          published,
        },
        onSuccess: (blog) => {
          toast.success('Blog updated successfully!');
          navigate(`/blogs/${blog.slug}`);
        },
        onError: (error) => {
          toast.error(error);
        },
      })
    );
  };

  const handleDelete = () => {
    if (!id) return;

    dispatch(
      deleteBlogRequest({
        id,
        onSuccess: () => {
          toast.success('Blog deleted successfully!');
          navigate('/blogs');
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

  if (isLoadingBlog) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <Spinner size="large" center />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Edit Blog</h1>
          <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
            <Button
              variant="danger"
              onClick={() => setShowDeleteModal(true)}
            >
              Delete
            </Button>
            <Button variant="ghost" onClick={() => navigate(-1)}>
              Cancel
            </Button>
          </div>
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
            <span>Published</span>
          </label>

          {/* Actions */}
          <div className={styles.actions}>
            <Button
              type="submit"
              variant="primary"
              size="large"
              isLoading={isLoading}
            >
              Update Blog
            </Button>
          </div>
        </form>

        {/* Delete confirmation modal */}
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Delete Blog?"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
            <p>Are you sure you want to delete this blog? This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: 'var(--spacing-sm)', justifyContent: 'flex-end' }}>
              <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleDelete}
                isLoading={isLoading}
              >
                Delete
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default EditBlogPage;