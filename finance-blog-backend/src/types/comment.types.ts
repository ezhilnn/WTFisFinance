import { TimestampFields, PublicUserInfo } from './common.types';

// Comment document structure in Firestore
export interface Comment extends TimestampFields {
  id: string;
  blogId: string;
  user: PublicUserInfo; // Name + email (email not shown publicly)
  content: string;
  likesCount: number;
  
  // Optional nested replies
  parentId?: string; // If this is a reply to another comment
  replyCount?: number; // Number of replies to this comment
}

// Request body for creating a comment
export interface CreateCommentRequest {
  blogId: string;
  content: string;
  name: string;
  email: string;
  parentId?: string; // For nested replies
}

// Public comment view (email hidden)
export interface PublicComment extends Omit<Comment, 'user'> {
  user: {
    name: string;
    // email is NOT included in public view
  };
}