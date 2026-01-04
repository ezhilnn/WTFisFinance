# 🚀 Quick Start Guide

Get your backend up and running in 10 minutes!

## Step 1: Install Dependencies (2 min)

```powershell
# Navigate to project folder
cd finance-blog-backend

# Install all packages
npm install
```

## Step 2: Set Up Firebase (5 min)

### 2.1 Create Firebase Project

1. Go to https://console.firebase.google.com/
2. Click "Add Project"
3. Enter project name: `finance-blog-platform`
4. Disable Google Analytics (optional for now)
5. Click "Create Project"

### 2.2 Enable Firestore

1. In left sidebar, click "Firestore Database"
2. Click "Create Database"
3. Select "Start in production mode"
4. Choose location: `asia-south1` (Mumbai, India)
5. Click "Enable"

### 2.3 Enable Google Authentication

1. In left sidebar, click "Authentication"
2. Click "Get Started"
3. Click "Google" provider
4. Toggle "Enable"
5. Enter project support email
6. Click "Save"

### 2.4 Get Service Account Credentials

1. Click ⚙️ (Settings) > "Project Settings"
2. Go to "Service Accounts" tab
3. Click "Generate New Private Key"
4. Click "Generate Key" (downloads JSON file)
5. **Keep this file secure!**

## Step 3: Configure Environment (2 min)

1. Open the downloaded JSON file
2. Copy `.env.example` to `.env`
3. Fill in the values:

```env
PORT=5000
NODE_ENV=development

# From the JSON file:
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...your key...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com

# Your Google email for admin access:
ADMIN_EMAIL=your-email@gmail.com

FRONTEND_URL=http://localhost:3000
```

**Important Notes:**
- Keep the quotes around `FIREBASE_PRIVATE_KEY`
- Keep all the `\n` characters in the private key
- Use the exact Google email you'll log in with

## Step 4: Run the Server (1 min)

```powershell
# Start in development mode
npm run dev
```

You should see:
```
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║        🚀 Finance Blog Platform Backend Server           ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝

✅ Server running on port 5000
🌐 Environment: development
👤 Admin Email: your-email@gmail.com
```

## Step 5: Test the API (1 min)

Open a new PowerShell window and test:

```powershell
# Test health endpoint
curl http://localhost:5000/health

# Test getting tags (should return empty array initially)
curl http://localhost:5000/api/tags
```

## ✅ You're Done!

Your backend is now running! Next steps:

1. **Test in Postman/Thunder Client**: Import the API endpoints
2. **Build the Frontend**: Connect React app to this backend
3. **Deploy to Cloud**: Follow deployment guide in README

## 🐛 Common Issues

### Firebase initialization failed
```
❌ Check your .env file
✓ Ensure FIREBASE_PROJECT_ID is correct
✓ Ensure FIREBASE_PRIVATE_KEY has \n characters
✓ Ensure FIREBASE_CLIENT_EMAIL is correct
```

### Port already in use
```powershell
# Change PORT in .env file
PORT=5001
```

### Module not found
```powershell
# Reinstall dependencies
rm -rf node_modules
npm install
```

## 📞 Need Help?

- Check the full README.md for detailed documentation
- Verify all environment variables are set correctly
- Ensure Firebase project is properly configured

---

**Next: Build the Frontend! 🎨**