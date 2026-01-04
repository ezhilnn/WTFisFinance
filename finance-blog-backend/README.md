# Finance Blog Platform - Backend API

Educational finance blogging platform backend built with Node.js, TypeScript, Express, and Firebase Firestore.

## 🚀 Features

- **Blog Management**: CRUD operations for blog posts with rich text content
- **Public Comments**: Anyone can comment (no auth required, just name + email)
- **Like System**: Like blogs and comments without authentication
- **View Tracking**: Track views and engaged reads (≥15 seconds)
- **Tag System**: Organize blogs with tags
- **Admin Authentication**: Google OAuth for admin access only
- **SEO-Friendly**: Slug-based URLs, excerpts, read time calculation

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: Firebase Firestore (NoSQL)
- **Authentication**: Firebase Auth (Google OAuth for admin only)

## 📁 Project Structure

```
src/
├── config/           # Configuration files
│   ├── firebase.ts   # Firebase initialization
│   └── constants.ts  # App constants
├── controllers/      # Request handlers
├── models/          # Database operations
├── routes/          # API routes
├── middleware/      # Custom middleware
├── utils/           # Utility functions
├── types/           # TypeScript type definitions
├── app.ts           # Express app setup
└── server.ts        # Server entry point
```

## 🔧 Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase project with Firestore enabled

### Step 1: Clone and Install

```bash
cd finance-blog-backend
npm install
```

### Step 2: Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing)
3. Enable Firestore Database
4. Enable Authentication > Google Sign-In
5. Go to Project Settings > Service Accounts
6. Click "Generate New Private Key"
7. Save the JSON file securely

### Step 3: Environment Variables

Create a `.env` file in the root directory:

```bash
# Copy from .env.example
cp .env.example .env
```

Edit `.env` with your values:

```env
PORT=5000
NODE_ENV=development

# Firebase Configuration (from service account JSON)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com

# Admin Configuration
ADMIN_EMAIL=your-admin-email@gmail.com

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

**Important**: Replace `your-admin-email@gmail.com` with the Google account you'll use for admin access.

### Step 4: Run the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production build:
```bash
npm run build
npm start
```

The server will start on `http://localhost:5000`

## 📡 API Endpoints

### Public Endpoints (No Auth Required)

#### Blogs
- `GET /api/blogs/published` - Get all published blogs (paginated)
- `GET /api/blogs/slug/:slug` - Get blog by slug
- `GET /api/blogs/tag/:tagId` - Get blogs by tag

#### Comments
- `POST /api/comments` - Create a comment
- `GET /api/comments/blog/:blogId` - Get comments for a blog
- `GET /api/comments/:commentId/replies` - Get replies to a comment

#### Likes
- `POST /api/likes/toggle` - Toggle like (add/remove)
- `GET /api/likes/status/:targetId` - Check if user liked
- `GET /api/likes/count/:targetId` - Get like count

#### Views
- `POST /api/views/view` - Record a view
- `POST /api/views/engaged` - Record engaged read (≥15s)

#### Tags
- `GET /api/tags` - Get all tags
- `GET /api/tags/:id` - Get tag by ID
- `GET /api/tags/slug/:slug` - Get tag by slug

### Admin Endpoints (Auth Required)

**Headers Required**: 
```
Authorization: Bearer <firebase-id-token>
```

#### Blogs
- `POST /api/blogs` - Create a new blog
- `GET /api/blogs` - Get all blogs (including unpublished)
- `GET /api/blogs/:id` - Get blog by ID
- `PUT /api/blogs/:id` - Update a blog
- `DELETE /api/blogs/:id` - Delete a blog

#### Comments
- `DELETE /api/comments/:id` - Delete a comment

#### Tags
- `POST /api/tags` - Create a tag (usually auto-created)

#### Admin
- `GET /api/admin/verify` - Verify admin status
- `GET /api/admin/info` - Get admin info

## 📝 Request/Response Examples

### Create a Blog (Admin)

**Request:**
```http
POST /api/blogs
Authorization: Bearer <firebase-id-token>
Content-Type: application/json

{
  "title": "Understanding Mutual Funds",
  "content": [
    {
      "type": "paragraph",
      "content": "Mutual funds are investment vehicles..."
    },
    {
      "type": "heading",
      "level": 2,
      "content": "Types of Mutual Funds"
    }
  ],
  "tags": ["mutual-funds", "investing", "basics"],
  "published": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Blog created successfully",
  "data": {
    "id": "abc123",
    "title": "Understanding Mutual Funds",
    "slug": "understanding-mutual-funds",
    "excerpt": "Mutual funds are investment vehicles...",
    "readTime": 5,
    "views": 0,
    "likesCount": 0,
    "commentsCount": 0,
    "published": true,
    "publishedAt": "2024-01-15T10:30:00.000Z",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Create a Comment (Public)

**Request:**
```http
POST /api/comments
Content-Type: application/json

{
  "blogId": "abc123",
  "content": "Great explanation! Very helpful.",
  "name": "Rahul Sharma",
  "email": "rahul@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Comment posted successfully",
  "data": {
    "id": "comment123",
    "blogId": "abc123",
    "user": {
      "name": "Rahul Sharma"
    },
    "content": "Great explanation! Very helpful.",
    "likesCount": 0,
    "createdAt": "2024-01-15T10:35:00.000Z"
  }
}
```

## 🔒 Security

- Admin authentication via Firebase Google OAuth
- Admin email hardcoded in environment variables
- Rate limiting via session-based cooldown for views
- Input validation on all endpoints
- CORS protection

## 🌐 Deploying to Google Cloud (Free Tier)

### Option 1: Cloud Run (Recommended)

1. Install Google Cloud CLI
2. Build and deploy:

```bash
gcloud run deploy finance-blog-api \
  --source . \
  --platform managed \
  --region asia-south1 \
  --allow-unauthenticated
```

3. Set environment variables in Cloud Run console

### Option 2: App Engine

1. Create `app.yaml`:
```yaml
runtime: nodejs18
env: standard
```

2. Deploy:
```bash
gcloud app deploy
```

### Firestore (Already Free)

- Up to 1 GB storage
- 50,000 reads/day
- 20,000 writes/day
- 20,000 deletes/day

## 🔍 Testing

Test the health endpoint:
```bash
curl http://localhost:5000/health
```

Test creating a blog (with valid Firebase token):
```bash
curl -X POST http://localhost:5000/api/blogs \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Blog",
    "content": [{"type": "paragraph", "content": "Test content"}],
    "tags": ["test"],
    "published": true
  }'
```

## 🐛 Troubleshooting

**Firebase initialization failed:**
- Check your service account credentials
- Ensure FIREBASE_PRIVATE_KEY has proper line breaks (`\n`)
- Verify project ID matches

**CORS errors:**
- Update FRONTEND_URL in .env
- Check CORS configuration in app.ts

**Admin not authorized:**
- Verify ADMIN_EMAIL matches your Google account
- Ensure Firebase token is valid

## 📄 License

MIT License - Educational purposes only

## ⚠️ Legal Disclaimer

This platform is for educational and informational purposes only. The content does not constitute investment advice. The author is not a SEBI-registered investment advisor.

## 🔮 Phase 2 Features (Planned)

- OAuth authentication for readers
- Paywall/partial content
- Public author onboarding
- Custom domain support
- Image uploads
- Analytics dashboard

---

**Built with ❤️ for financial education in India**