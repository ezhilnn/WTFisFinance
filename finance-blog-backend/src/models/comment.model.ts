import { db,FieldValue } from '../config/firebase';

import { COLLECTIONS } from '../config/constants';
import { Comment, CreateCommentRequest, PublicComment } from '../types/comment.types';

const commentsCollection = db.collection(COLLECTIONS.COMMENTS);
const blogsCollection = db.collection(COLLECTIONS.BLOGS);

// Create a new comment
export const createComment = async (
  commentData: CreateCommentRequest
): Promise<Comment> => {
  const now = new Date().toISOString();
  
  const comment: Omit<Comment, 'id'> = {
    blogId: commentData.blogId,
    user: {
      name: commentData.name,
      email: commentData.email,
    },
    content: commentData.content,
    likesCount: 0,
    parentId: commentData.parentId,
    replyCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  const docRef = await commentsCollection.add(comment);
  
  // Increment blog comment count
  await blogsCollection.doc(commentData.blogId).update({
    commentsCount: FieldValue.increment(1),
  });

  // If this is a reply, increment parent's reply count
  if (commentData.parentId) {
    await commentsCollection.doc(commentData.parentId).update({
      replyCount: FieldValue.increment(1),
    });
  }

  return { ...comment, id: docRef.id };
};

// Get comment by ID
export const getCommentById = async (id: string): Promise<Comment | null> => {
  const doc = await commentsCollection.doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() } as Comment;
};

// Get all comments for a blog
export const getCommentsByBlogId = async (blogId: string): Promise<PublicComment[]> => {
  const snapshot = await commentsCollection
    .where('blogId', '==', blogId)
    .orderBy('createdAt', 'asc')
    .get();

  // Convert to public format (hide email)
  return snapshot.docs.map(doc => {
    const comment = { id: doc.id, ...doc.data() } as Comment;
    return {
      ...comment,
      user: { name: comment.user.name },
    } as PublicComment;
  });
};

// Get replies to a comment
export const getRepliesByParentId = async (parentId: string): Promise<PublicComment[]> => {
  const snapshot = await commentsCollection
    .where('parentId', '==', parentId)
    .orderBy('createdAt', 'asc')
    .get();

  return snapshot.docs.map(doc => {
    const comment = { id: doc.id, ...doc.data() } as Comment;
    return {
      ...comment,
      user: { name: comment.user.name },
    } as PublicComment;
  });
};

// Delete comment
export const deleteComment = async (id: string): Promise<void> => {
  const comment = await getCommentById(id);
  if (!comment) return;

  await commentsCollection.doc(id).delete();
  
  // Decrement blog comment count
  await blogsCollection.doc(comment.blogId).update({
    commentsCount: FieldValue.increment(-1),
  });

  // If this was a reply, decrement parent's reply count
  if (comment.parentId) {
    await commentsCollection.doc(comment.parentId).update({
      replyCount: FieldValue.increment(-1),
    });
  }
};