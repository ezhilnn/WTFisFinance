// src/features/tags/types/tag.types.ts

export interface Tag {
  id: string;
  name: string;
  slug: string;
  blogCount: number;
  createdAt: string;
}

export interface TagState {
  tags: Tag[];
  selectedTag: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface FetchTagsPayload {
  // Empty for now
}

export interface SelectTagPayload {
  tagId: string | null;
}