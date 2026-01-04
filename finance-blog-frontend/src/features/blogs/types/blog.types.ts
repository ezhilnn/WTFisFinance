import type { TimestampFields, PaginatedResponse } from '../../../types/common.types';

// Editor content structure (matches backend)
export interface EditorContent {
  type: string;
  content?: string;
  level?: number;
  language?: string;
  children?: EditorContent[];
}

// Blog from API
export interface Blog extends TimestampFields {
  id: string;
  title: string;
  content: EditorContent[];
  excerpt: string;
  tags: string[]; // Tag IDs
  authorEmail: string;
  authorName: string;
  published: boolean;
  publishedAt?: string;
  views: number;
  engagedReads: number;
  likesCount: number;
  commentsCount: number;
  slug: string;
  readTime: number;
}

// Tag from API
export interface Tag {
  id: string;
  name: string;
  slug: string;
  blogCount: number;
  createdAt: string;
}

// Blog state
export interface BlogState {
  blogs: Blog[];
  currentBlog: Blog | null;
  tags: Tag[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
}

// Create blog request
export interface CreateBlogRequest {
  title: string;
  content: EditorContent[];
  tags: string[]; // Tag names
  published: boolean;
}

// Update blog request
export interface UpdateBlogRequest {
  id: string;
  title?: string;
  content?: EditorContent[];
  tags?: string[];
  published?: boolean;
}

// Action payloads
export interface FetchBlogsPayload {
  page?: number;
  limit?: number;
}

export interface FetchBlogBySlugPayload {
  slug: string;
}

export interface CreateBlogPayload {
  data: CreateBlogRequest;
  onSuccess?: (blog: Blog) => void;
  onError?: (error: string) => void;
}

export interface UpdateBlogPayload {
  data: UpdateBlogRequest;
  onSuccess?: (blog: Blog) => void;
  onError?: (error: string) => void;
}

export interface DeleteBlogPayload {
  id: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}