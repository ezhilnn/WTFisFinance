import { db } from '../config/firebase';
import { COLLECTIONS, ADMIN_EMAIL } from '../config/constants';
import { User, CreateUserRequest } from '../types/user.types';

const usersCollection = db.collection(COLLECTIONS.USERS);

// Determine user role based on email
const getUserRole = (email: string): 'admin' | 'user' => {
  return email === ADMIN_EMAIL ? 'admin' : 'user';
};

// Create or update user (called after login - email/password OR OAuth)
export const createOrUpdateUser = async (
  userData: CreateUserRequest
): Promise<User> => {
  const now = new Date().toISOString();
  const userRef = usersCollection.doc(userData.uid);
  
  // Check if user exists
  const doc = await userRef.get();
  
  if (doc.exists) {
    // User exists - just update timestamps
    await userRef.update({
      updatedAt: now,
    });
    
    const updatedDoc = await userRef.get();
    return { uid: updatedDoc.id, ...updatedDoc.data() } as User;
  } else {
    // Check if email already exists (prevent duplicates)
    const existingUser = await getUserByEmail(userData.email);
    if (existingUser) {
      throw new Error('Email already registered with different account');
    }
    
    // New user - create profile
    const newUser: Omit<User, 'uid'> = {
      email: userData.email,
      role: getUserRole(userData.email),
      createdAt: now,
      updatedAt: now,
    };
    
    await userRef.set(newUser);
    return { uid: userData.uid, ...newUser };
  }
};

// Get user by UID
export const getUserByUid = async (uid: string): Promise<User | null> => {
  const doc = await usersCollection.doc(uid).get();
  if (!doc.exists) return null;
  return { uid: doc.id, ...doc.data() } as User;
};

// Get user by email
export const getUserByEmail = async (email: string): Promise<User | null> => {
  const snapshot = await usersCollection.where('email', '==', email).limit(1).get();
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { uid: doc.id, ...doc.data() } as User;
};

// Check if user is admin
export const isAdmin = async (uid: string): Promise<boolean> => {
  const user = await getUserByUid(uid);
  return user?.role === 'admin';
};

// Get all users (admin only)
export const getAllUsers = async (): Promise<User[]> => {
  const snapshot = await usersCollection.orderBy('createdAt', 'desc').get();
  return snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as User));
};