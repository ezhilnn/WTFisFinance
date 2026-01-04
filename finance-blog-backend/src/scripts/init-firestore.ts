/**
 * Firestore Initialization Script
 * 
 * This script creates all necessary collections and indexes in Firestore.
 * Run this ONCE after setting up your Firebase project.
 * 
 * Usage:
 * 1. Ensure .env file is configured
 * 2. Run: npx ts-node scripts/init-firestore.ts
 */
import dotenv from 'dotenv';
import admin from 'firebase-admin';


// Load environment variables
dotenv.config();

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  }),
});

const db = admin.firestore();

async function initializeCollections() {
  console.log('🚀 Initializing Firestore Collections...\n');

  try {
    // ============================================
    // 1. BLOGS COLLECTION
    // ============================================
    console.log('📝 Creating BLOGS collection...');
    const blogRef = db.collection('blogs').doc('_init_blog_sample');
    await blogRef.set({
      title: 'Welcome to Finance Blog Platform',
      content: [
        {
          type: 'paragraph',
          content: 'This is a sample blog post to initialize the collection. You can delete this once you create your first real blog.',
        },
        {
          type: 'heading',
          level: 2,
          content: 'Getting Started',
        },
        {
          type: 'paragraph',
          content: 'Start writing educational finance content and help people learn!',
        },
      ],
      excerpt: 'This is a sample blog post to initialize the collection.',
      tags: [],
      authorEmail: process.env.ADMIN_EMAIL || 'admin@example.com',
      authorName: 'Admin',
      published: false,
      views: 0,
      engagedReads: 0,
      likesCount: 0,
      commentsCount: 0,
      slug: 'welcome-to-finance-blog-platform',
      readTime: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    console.log('✅ BLOGS collection created with sample document\n');

    // ============================================
    // 2. COMMENTS COLLECTION
    // ============================================
    console.log('💬 Creating COMMENTS collection...');
    const commentRef = db.collection('comments').doc('_init_comment_sample');
    await commentRef.set({
      blogId: '_init_blog_sample',
      user: {
        name: 'Sample User',
        email: 'sample@example.com',
      },
      content: 'This is a sample comment to initialize the collection.',
      likesCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    console.log('✅ COMMENTS collection created with sample document\n');

    // ============================================
    // 3. LIKES COLLECTION
    // ============================================
    console.log('❤️ Creating LIKES collection...');
    const likeRef = db.collection('likes').doc('_init_like_sample');
    await likeRef.set({
      targetId: '_init_blog_sample',
      targetType: 'blog',
      sessionId: 'init-session-12345',
      createdAt: new Date().toISOString(),
    });
    console.log('✅ LIKES collection created with sample document\n');

    // ============================================
    // 4. TAGS COLLECTION
    // ============================================
    console.log('🏷️ Creating TAGS collection with common finance tags...');
    
    const commonTags = [
      'Mutual Funds',
      'Stock Market',
      'Personal Finance',
      'Investment Basics',
      'Tax Planning',
      'Insurance',
      'Fixed Deposits',
      'Retirement Planning',
      'Real Estate',
      'Cryptocurrency',
    ];

    for (const tagName of commonTags) {
      const tagSlug = tagName.toLowerCase().replace(/\s+/g, '-');
      await db.collection('tags').doc(`tag_${tagSlug}`).set({
        name: tagName,
        slug: tagSlug,
        blogCount: 0,
        createdAt: new Date().toISOString(),
      });
    }
    console.log(`✅ TAGS collection created with ${commonTags.length} common tags\n`);

    // ============================================
    // 5. VIEWS COLLECTION
    // ============================================
    console.log('👁️ Creating VIEWS collection...');
    const viewRef = db.collection('views').doc('_init_view_sample');
    await viewRef.set({
      blogId: '_init_blog_sample',
      sessionId: 'init-session-12345',
      viewedAt: new Date().toISOString(),
      engagedRead: false,
    });
    console.log('✅ VIEWS collection created with sample document\n');

    // ============================================
    // CLEANUP SAMPLE DOCUMENTS (OPTIONAL)
    // ============================================
    console.log('🧹 Cleaning up sample documents...');
    // await blogRef.delete();
    // await commentRef.delete();
    // await likeRef.delete();
    // await viewRef.delete();
    console.log('✅ Sample documents cleaned up\n');

    // ============================================
    // SUMMARY
    // ============================================
    console.log('═══════════════════════════════════════════════════════');
    console.log('✨ Firestore Initialization Complete!');
    console.log('═══════════════════════════════════════════════════════');
    console.log('');
    console.log('📊 Collections Created:');
    console.log('   ✓ blogs');
    console.log('   ✓ comments');
    console.log('   ✓ likes');
    console.log('   ✓ tags (with 10 common finance tags)');
    console.log('   ✓ views');
    console.log('');
    console.log('🔒 Admin Email:', process.env.ADMIN_EMAIL);
    console.log('');
    console.log('⚠️  IMPORTANT: Set up Firestore indexes manually:');
    console.log('   Go to Firebase Console > Firestore > Indexes');
    console.log('   Add the following composite indexes:');
    console.log('');
    console.log('   1. Collection: blogs');
    console.log('      - published (Ascending) + publishedAt (Descending)');
    console.log('');
    console.log('   2. Collection: comments');
    console.log('      - blogId (Ascending) + createdAt (Ascending)');
    console.log('');
    console.log('   3. Collection: likes');
    console.log('      - targetId (Ascending) + sessionId (Ascending)');
    console.log('');
    console.log('   4. Collection: views');
    console.log('      - blogId (Ascending) + sessionId (Ascending) + viewedAt (Descending)');
    console.log('');
    console.log('═══════════════════════════════════════════════════════');

  } catch (error) {
    console.error('❌ Error initializing Firestore:', error);
    process.exit(1);
  }

  process.exit(0);
}

// Run the initialization
initializeCollections();