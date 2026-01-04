import { db,FieldValue} from '../config/firebase';
import { COLLECTIONS } from '../config/constants';

const likesCollection = db.collection(COLLECTIONS.LIKES);
const blogsCollection = db.collection(COLLECTIONS.BLOGS);
const commentsCollection = db.collection(COLLECTIONS.COMMENTS);

// Like structure in Firestore
interface Like {
  id: string;
  targetId: string; // Blog or Comment ID
  targetType: 'blog' | 'comment';
  sessionId: string; // Browser session/fingerprint to prevent spam
  createdAt: string;
}

// Check if session already liked the target
export const hasLiked = async (
  targetId: string,
  sessionId: string
): Promise<boolean> => {
  const snapshot = await likesCollection
    .where('targetId', '==', targetId)
    .where('sessionId', '==', sessionId)
    .limit(1)
    .get();

  return !snapshot.empty;
};

// Add a like
export const addLike = async (
  targetId: string,
  targetType: 'blog' | 'comment',
  sessionId: string
): Promise<Like> => {
  const now = new Date().toISOString();
  
  const like: Omit<Like, 'id'> = {
    targetId,
    targetType,
    sessionId,
    createdAt: now,
  };

  const docRef = await likesCollection.add(like);
  
  // Increment like count on target
  if (targetType === 'blog') {
    await blogsCollection.doc(targetId).update({
      likesCount: FieldValue.increment(1),
    });
  } else {
    await commentsCollection.doc(targetId).update({
      likesCount: FieldValue.increment(1),
    });
  }

  return { ...like, id: docRef.id };
};

// Remove a like
export const removeLike = async (
  targetId: string,
  targetType: 'blog' | 'comment',
  sessionId: string
): Promise<void> => {
  const snapshot = await likesCollection
    .where('targetId', '==', targetId)
    .where('sessionId', '==', sessionId)
    .limit(1)
    .get();

  if (snapshot.empty) return;

  const doc = snapshot.docs[0];
  await likesCollection.doc(doc.id).delete();
  
  // Decrement like count on target
  if (targetType === 'blog') {
    await blogsCollection.doc(targetId).update({
      likesCount: FieldValue.increment(-1),
    });
  } else {
    await commentsCollection.doc(targetId).update({
      likesCount: FieldValue.increment(-1),
    });
  }
};

// Get like count for a target
export const getLikeCount = async (targetId: string): Promise<number> => {
  const snapshot = await likesCollection
    .where('targetId', '==', targetId)
    .count()
    .get();

  return snapshot.data().count;
};