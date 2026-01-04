/**
 * Users Collection Setup
 * 
 * Stores minimal user data for authentication:
 * - uid (Firebase Auth UID)
 * - email (unique, no duplicates)
 * - role (admin or user)
 * 
 * Run this after init-firestore.ts
 */

import admin from 'firebase-admin';
import dotenv from 'dotenv';

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

async function createUsersCollection() {
  console.log('👥 Creating USERS collection...\n');

  try {
    // Create sample admin user
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminRef = db.collection('users').doc('sample_admin_uid');
    
    await adminRef.set({
      uid: 'sample_admin_uid',
      email: adminEmail,
      role: 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    console.log('✅ USERS collection created with admin sample\n');
    
    // Create sample regular user
    const userRef = db.collection('users').doc('sample_user_uid');
    
    
    await userRef.set({
      uid: 'sample_user_uid',
      email: 'user@example.com',
      role: 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    console.log('✅ Sample regular user created\n');

    // Clean up sample documents
    console.log('🧹 Cleaning up sample documents...');
    await adminRef.delete();
    await userRef.delete();
    console.log('✅ Sample documents cleaned up\n');

    console.log('═══════════════════════════════════════════════════════');
    console.log('✨ Users Collection Initialized!');
    console.log('═══════════════════════════════════════════════════════');
    console.log('');
    console.log('📊 User Document Structure (MINIMAL):');
    console.log('   {');
    console.log('     uid: string,           // Firebase Auth UID');
    console.log('     email: string,         // Unique email (no duplicates)');
    console.log('     role: "admin" | "user",// User role');
    console.log('     createdAt: string,');
    console.log('     updatedAt: string');
    console.log('   }');
    console.log('');
    console.log('🔑 Admin Email:', process.env.ADMIN_EMAIL);
    console.log('   Only this email will have role: "admin"');
    console.log('   All others will have role: "user"');
    console.log('');
    console.log('🔐 Authentication Methods:');
    console.log('   ✓ Email/Password');
    console.log('   ✓ Google OAuth');
    console.log('');
    console.log('💬 Comments: Anonymous (no login required)');
    console.log('');
    console.log('⚠️  IMPORTANT: Create unique index on "email" field');
    console.log('   Go to Firestore Console > Indexes');
    console.log('   Collection: users');
    console.log('   Field: email (Ascending)');
    console.log('   Query scope: Collection');
    console.log('');
    console.log('═══════════════════════════════════════════════════════');

  } catch (error) {
    console.error('❌ Error creating users collection:', error);
    process.exit(1);
  }

  process.exit(0);
}

// Run the initialization
createUsersCollection();