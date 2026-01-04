import { TimestampFields } from './common.types';

// Rich text editor content structure (JSON format)
export interface EditorContent {
  type: string; // 'paragraph', 'heading', 'code', etc.
  content?: string;
  level?: number; // For headings (1-6)
  language?: string; // For code blocks
  children?: EditorContent[];
}

// Blog document structure in Firestore
export interface Blog extends TimestampFields {
  id: string;
  title: string;
  content: EditorContent[]; // Rich text content as JSON
  excerpt: string; // First 160 chars for SEO
  tags: string[]; // Array of tag IDs
  authorEmail: string; // Admin email
  authorName: string; // Admin display name
  
  // Status
  published: boolean;
  publishedAt?: string; // ISO 8601 format
  
  // Metrics
  views: number;
  engagedReads: number; // Views with ≥15 seconds
  likesCount: number;
  commentsCount: number;
  
  // SEO
  slug: string; // URL-friendly version of title
  readTime: number; // Estimated read time in minutes
}

// Request body for creating/updating a blog
export interface CreateBlogRequest {
  title: string;
  content: EditorContent[];
  tags: string[]; // Can include new tag names
  published: boolean;
}

export interface UpdateBlogRequest extends Partial<CreateBlogRequest> {
  id: string;
}