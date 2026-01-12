// src/features/learn/types/learn.types.ts

// Rich text editor content (same as blog)
export interface EditorContent {
  type: string;
  content?: any;
  attrs?: Record<string, any>;
  marks?: Array<{ type: string }>;
  text?: string;
}

// Category
export interface Category {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  order: number;
}

// Sub-Anchor (lesson group within an anchor)
export interface SubAnchor {
  id: string;
  title: string;
  slug: string;
  order: number;
}

// Anchor (expandable section within a product)
export interface Anchor {
  id: string;
  title: string;
  slug: string;
  order: number;
  subAnchors: SubAnchor[];
}

// Product (now contains anchors)
export interface Product {
  id: string;
  categoryId: string;
  slug: string;
  title: string;
  description: string;
  order: number;
  anchors: Anchor[];
}

// Lesson Index (metadata only, stored in lessons-index.json)
export interface LessonIndex {
  id: string;
  productId: string;
  anchorId: string;
  subAnchorId: string;
  title: string;
  slug: string;
  contentPath: string;
  orderInSubAnchor: number;
  version: number;
  isLatest: boolean;
}

// Lesson (full lesson with loaded content)
export interface Lesson {
  id: string;
  productId: string;
  anchorId: string;
  subAnchorId: string;
  title: string;
  slug: string;
  contentJSON: EditorContent[];
  orderInSubAnchor: number;
  version: number;
  isLatest: boolean;
}

// Quiz Question
export interface QuizQuestion {
  q: string;
  options: string[];
  correctIndex: number;
}

// Quiz (attached to product, one per product)
export interface Quiz {
  id: string;
  productId: string;
  questions: QuizQuestion[];
}

// Version tracking
export interface VersionEntry {
  lessonId: string;
  editedAt: string;
}

export interface VersionGroup {
  versionGroupId: string;
  versions: VersionEntry[];
}

// Helpers for frontend usage
export interface LessonsBySubAnchor {
  [subAnchorId: string]: Lesson[];
}

export interface SubAnchorWithLessons extends SubAnchor {
  lessons: Lesson[];
}

export interface AnchorWithContent extends Anchor {
  subAnchorsWithLessons: SubAnchorWithLessons[];
}

export interface ProductWithContent extends Product {
  anchorsWithContent: AnchorWithContent[];
  quiz?: Quiz;
}