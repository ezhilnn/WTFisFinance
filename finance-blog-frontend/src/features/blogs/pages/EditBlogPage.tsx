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
  const { id: slugOrId } = useParams<{ id: string }>(); // Get the route param (could be slug or id)
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const { tags, isLoading } = useAppSelector((state) => state.blogs);

  const [blogId, setBlogId] = useState('');
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
      if (!slugOrId) {
        console.error('No slug/id provided');
        return;
      }

      try {
        setIsLoadingBlog(true);
        console.log('Loading blog with slug/id:', slugOrId);
        
        const blog = await getBlogBySlug(slugOrId); // getBlogBySlug works with slugs
        console.log('Blog loaded:', blog);
        
        setBlogId(blog.id);
        setTitle(blog.title);
        
        // Convert content array to JSON string for editor
        const contentStr = Array.isArray(blog.content)
          ? JSON.stringify({ type: 'doc', content: blog.content })
          : typeof blog.content === 'string'
          ? blog.content
          : JSON.stringify(blog.content);
        
        console.log('Content prepared for editor');
        setContent(contentStr);
        setSelectedTags(blog.tags);
        setPublished(blog.published);
      } catch (error) {
        console.error('Error loading blog:', error);
        toast.error('Failed to load blog');
        navigate('/blogs');
      } finally {
        setIsLoadingBlog(false);
      }
    };

    loadBlog();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slugOrId]); // Only depend on slugOrId

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    const newErrors: { title?: string; content?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    // Check if content is empty (TipTap's empty state)
    let parsedContent;
    try {
      parsedContent = JSON.parse(content || '{}');
      const isEmpty = 
        !parsedContent.content || 
        parsedContent.content.length === 0 ||
        (parsedContent.content.length === 1 && 
         parsedContent.content[0].type === 'paragraph' && 
         !parsedContent.content[0].content);
      
      if (isEmpty) {
        newErrors.content = 'Content is required';
      }
    } catch (error) {
      newErrors.content = 'Invalid content format';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    if (!blogId) return;

    // Update blog
    dispatch(
      updateBlogRequest({
        data: {
          id: blogId,
          title: title.trim(),
          content: parsedContent.content || [],
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
    if (!blogId) return;

    dispatch(
      deleteBlogRequest({
        id: blogId,
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