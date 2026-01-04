import { db , FieldValue} from '../config/firebase';
import { COLLECTIONS } from '../config/constants';
import { generateSlug } from '../utils/validators.util';

const tagsCollection = db.collection(COLLECTIONS.TAGS);

// Tag structure
export interface Tag {
  id: string;
  name: string;
  slug: string;
  blogCount: number;
  createdAt: string;
}

// Create a new tag
export const createTag = async (name: string): Promise<Tag> => {
  const now = new Date().toISOString();
  const slug = generateSlug(name);
  
  // Check if tag already exists
  const existing = await getTagBySlug(slug);
  if (existing) return existing;
  
  const tag: Omit<Tag, 'id'> = {
    name,
    slug,
    blogCount: 0,
    createdAt: now,
  };

  const docRef = await tagsCollection.add(tag);
  return { ...tag, id: docRef.id };
};

// Get tag by ID
export const getTagById = async (id: string): Promise<Tag | null> => {
  const doc = await tagsCollection.doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() } as Tag;
};

// Get tag by slug
export const getTagBySlug = async (slug: string): Promise<Tag | null> => {
  const snapshot = await tagsCollection.where('slug', '==', slug).limit(1).get();
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as Tag;
};

// Get tag by name
export const getTagByName = async (name: string): Promise<Tag | null> => {
  const snapshot = await tagsCollection.where('name', '==', name).limit(1).get();
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as Tag;
};

// Get all tags
export const getAllTags = async (): Promise<Tag[]> => {
  const snapshot = await tagsCollection.orderBy('name', 'asc').get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tag));
};

// Increment blog count for a tag
export const incrementTagBlogCount = async (tagId: string): Promise<void> => {
  await tagsCollection.doc(tagId).update({
    blogCount: FieldValue.increment(1),
  });
};

// Decrement blog count for a tag
export const decrementTagBlogCount = async (tagId: string): Promise<void> => {
  await tagsCollection.doc(tagId).update({
    blogCount: FieldValue.increment(-1),
  });
};

// Get or create tags by names (used when creating/updating blogs)
export const getOrCreateTags = async (tagNames: string[]): Promise<string[]> => {
  const tagIds: string[] = [];
  
  for (const name of tagNames) {
    let tag = await getTagByName(name);
    if (!tag) {
      tag = await createTag(name);
    }
    tagIds.push(tag.id);
  }
  
  return tagIds;
};