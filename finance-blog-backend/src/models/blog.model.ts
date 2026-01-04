import { db, FieldValue } from '../config/firebase';
import { COLLECTIONS, WORDS_PER_MINUTE } from '../config/constants';
import { Blog, CreateBlogRequest } from '../types/blog.types';
import { generateSlug, generateExcerpt } from '../utils/validators.util';

const blogsCollection = db.collection(COLLECTIONS.BLOGS);

// Helper: Extract plain text from editor content for read time calculation
const extractPlainText = (content: any[]): string => {
  return content
    .map(block => {
      if (block.content) return block.content;
      if (block.children) return extractPlainText(block.children);
      return '';
    })
    .join(' ');
};

// Helper: Calculate read time from content
const calculateReadTime = (content: any[]): number => {
  const plainText = extractPlainText(content);
  const wordCount = plainText.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
};

// Create a new blog
export const createBlog = async (
  blogData: CreateBlogRequest,
  authorEmail: string,
  authorName: string
): Promise<Blog> => {
  const now = new Date().toISOString();
  const plainText = extractPlainText(blogData.content);
  
  const blog: Omit<Blog, 'id'> = {
    title: blogData.title,
    content: blogData.content,
    excerpt: generateExcerpt(plainText),
    tags: blogData.tags,
    authorEmail,
    authorName,
    published: blogData.published,
    publishedAt: blogData.published ? now : undefined,
    views: 0,
    engagedReads: 0,
    likesCount: 0,
    commentsCount: 0,
    slug: generateSlug(blogData.title),
    readTime: calculateReadTime(blogData.content),
    createdAt: now,
    updatedAt: now,
  };

  const docRef = await blogsCollection.add(blog);
  return { ...blog, id: docRef.id };
};

// Get blog by ID
export const getBlogById = async (id: string): Promise<Blog | null> => {
  const doc = await blogsCollection.doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() } as Blog;
};

// Get blog by slug
export const getBlogBySlug = async (slug: string): Promise<Blog | null> => {
  const snapshot = await blogsCollection.where('slug', '==', slug).limit(1).get();
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as Blog;
};

// Get all published blogs (paginated)
export const getAllPublishedBlogs = async (
  page: number = 1,
  limit: number = 10
): Promise<{ blogs: Blog[]; total: number }> => {
  const offset = (page - 1) * limit;
  
  const snapshot = await blogsCollection
    .where('published', '==', true)
    .orderBy('publishedAt', 'desc')  // ← Use publishedAt to match your existing index
    // .orderBy('createdAt', 'desc')  // ← Changed to createdAt
    .limit(limit)
    .offset(offset)
    .get();

  const countSnapshot = await blogsCollection.where('published', '==', true).count().get();

  const blogs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Blog));
  return { blogs, total: countSnapshot.data().count };
};

// Get all blogs (admin only, includes unpublished)
export const getAllBlogs = async (
  page: number = 1,
  limit: number = 10
): Promise<{ blogs: Blog[]; total: number }> => {
  const offset = (page - 1) * limit;
  
  const snapshot = await blogsCollection
    .orderBy('createdAt', 'desc')
    .limit(limit)
    .offset(offset)
    .get();

  const countSnapshot = await blogsCollection.count().get();

  const blogs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Blog));
  return { blogs, total: countSnapshot.data().count };
};

// Update blog
export const updateBlog = async (id: string, updates: Partial<Blog>): Promise<Blog> => {
  const now = new Date().toISOString();
  
  // Recalculate fields if content changed
  if (updates.content) {
    const plainText = extractPlainText(updates.content);
    updates.excerpt = generateExcerpt(plainText);
    updates.readTime = calculateReadTime(updates.content);
  }
  
  if (updates.title) {
    updates.slug = generateSlug(updates.title);
  }

  // Set publishedAt when first publishing
  if (updates.published && !updates.publishedAt) {
    updates.publishedAt = now;
  }

  updates.updatedAt = now;

  await blogsCollection.doc(id).update(updates);
  return getBlogById(id) as Promise<Blog>;
};

// Delete blog
export const deleteBlog = async (id: string): Promise<void> => {
  await blogsCollection.doc(id).delete();
};

// Increment view count
export const incrementViews = async (id: string): Promise<void> => {
  await blogsCollection.doc(id).update({
    views: FieldValue.increment(1),
  });
};

// Increment engaged reads
export const incrementEngagedReads = async (id: string): Promise<void> => {
  await blogsCollection.doc(id).update({
    engagedReads: FieldValue.increment(1),
  });
};

// Get blogs by tag
export const getBlogsByTag = async (tagId: string): Promise<Blog[]> => {
  const snapshot = await blogsCollection
    .where('published', '==', true)
    .where('tags', 'array-contains', tagId)
    .orderBy('publishedAt', 'desc')
    .get();

  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Blog));
};