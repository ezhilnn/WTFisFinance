// src/features/comments/types/comment.types.ts

export interface Comment {
  id: string;
  blogId: string;
  user: {
    name: string;
  };
  content: string;
  likesCount: number;
  parentId?: string;
  replyCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentRequest {
  blogId: string;
  content: string;
  name: string;
  email: string;
  parentId?: string;
}

export interface CommentState {
  commentsByBlog: Record<string, Comment[]>; // blogId -> comments array
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  replyingTo: string | null;
}

export interface CreateCommentPayload {
  data: CreateCommentRequest;
  onSuccess?: (comment: Comment) => void;
  onError?: (error: string) => void;
}

export interface FetchCommentsPayload {
  blogId: string;
}

export interface DeleteCommentPayload {
  id: string;
  blogId: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export interface SetReplyingToPayload {
  commentId: string | null;
}