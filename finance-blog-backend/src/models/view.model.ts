import { db } from '../config/firebase';
import { COLLECTIONS, VIEW_CONFIG } from '../config/constants';
import { incrementViews, incrementEngagedReads } from './blog.model';

const viewsCollection = db.collection(COLLECTIONS.VIEWS);

// View session structure
interface ViewSession {
  id: string;
  blogId: string;
  sessionId: string; // Browser session/fingerprint
  viewedAt: string;
  engagedRead: boolean;
}

// Check if session recently viewed the blog (within cooldown period)
const hasRecentView = async (
  blogId: string,
  sessionId: string
): Promise<boolean> => {
  const cooldownTime = new Date(Date.now() - VIEW_CONFIG.SESSION_COOLDOWN * 1000).toISOString();
  
  const snapshot = await viewsCollection
    .where('blogId', '==', blogId)
    .where('sessionId', '==', sessionId)
    .where('viewedAt', '>', cooldownTime)
    .limit(1)
    .get();

  return !snapshot.empty;
};

// Record a view
export const recordView = async (
  blogId: string,
  sessionId: string
): Promise<{ recorded: boolean; reason?: string }> => {
  // Check if session recently viewed
  const hasRecent = await hasRecentView(blogId, sessionId);
  
  if (hasRecent) {
    return { recorded: false, reason: 'Recent view exists within cooldown period' };
  }

  const now = new Date().toISOString();
  
  const viewSession: Omit<ViewSession, 'id'> = {
    blogId,
    sessionId,
    viewedAt: now,
    engagedRead: false,
  };

  await viewsCollection.add(viewSession);
  await incrementViews(blogId);

  return { recorded: true };
};

// Record an engaged read (≥15 seconds)
export const recordEngagedRead = async (
  blogId: string,
  sessionId: string
): Promise<{ recorded: boolean; reason?: string }> => {
  // Find the view session
  const snapshot = await viewsCollection
    .where('blogId', '==', blogId)
    .where('sessionId', '==', sessionId)
    .orderBy('viewedAt', 'desc')
    .limit(1)
    .get();

  if (snapshot.empty) {
    return { recorded: false, reason: 'No view session found' };
  }

  const doc = snapshot.docs[0];
  const viewSession = doc.data() as ViewSession;

  // Check if already marked as engaged
  if (viewSession.engagedRead) {
    return { recorded: false, reason: 'Already marked as engaged read' };
  }

  // Update the session
  await viewsCollection.doc(doc.id).update({ engagedRead: true });
  await incrementEngagedReads(blogId);

  return { recorded: true };
};