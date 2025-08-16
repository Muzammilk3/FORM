# Vercel Deployment Fix Guide

## Issues Fixed

### 1. MongoDB Connection String
**Current (Incorrect):**
```
mongodb+srv://muzammilahmedk3:2cTwQqQDFB9JJdZY@cluster0.wyqdx2t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

**Fixed (Correct):**
```
mongodb+srv://muzammilahmedk3:2cTwQqQDFB9JJdZY@cluster0.wyqdx2t.mongodb.net/form-builder?retryWrites=true&w=majority&appName=Cluster0
```

**Key Change:** Added `/form-builder` before the `?` (database name)

### 2. Vercel Configuration
**Simplified vercel.json** - Removed explicit build commands to let Vercel auto-detect

### 3. Build Script Optimization
**Updated package.json** - Added `GENERATE_SOURCEMAP=false` to build script

## Render Configuration (Backend)

### Environment Variables:
```
NODE_ENV = production
PORT = 10000
MONGODB_URI = mongodb+srv://muzammilahmedk3:2cTwQqQDFB9JJdZY@cluster0.wyqdx2t.mongodb.net/form-builder?retryWrites=true&w=majority&appName=Cluster0
FRONTEND_URL = (leave empty for now)
```

### Service Settings:
```
Name:   custom-form-builder-backend
Repository: Muzammilk3/FORM
Branch: main
Root Directory: (leave empty)
Runtime: Node
Build Command: npm install
Start Command: npm start
Health Check Path: /api/health
```

## Vercel Configuration (Frontend)

### Project Settings:
```
Framework Preset: Create React App
Root Directory: client
Build Command: npm run build (auto-detected)
Output Directory: build (auto-detected)
Install Command: npm install (auto-detected)
```

### Environment Variables:
```
REACT_APP_API_URL = https://your-backend-name.onrender.com
```

## Deployment Steps

### 1. Deploy Backend on Render
1. Use the MongoDB connection string with database name
2. Set all environment variables
3. Deploy and note the backend URL

### 2. Deploy Frontend on Vercel
1. Use the simplified vercel.json
2. Set REACT_APP_API_URL to your backend URL
3. Deploy

### 3. Update CORS
1. Add your Vercel frontend URL to FRONTEND_URL in Render
2. Backend will automatically redeploy

## Troubleshooting

### If build still fails:
1. Clear Vercel cache in project settings
2. Check that all files are committed to GitHub
3. Verify the client/public/index.html file exists
4. Try redeploying

### Common Issues:
- **MongoDB connection:** Make sure database name is included
- **CORS errors:** Update FRONTEND_URL after Vercel deployment
- **Build failures:** Check that all dependencies are in package.json

