# Complete Deployment Guide

## Step 1: Deploy Backend on Render

### 1.1 Prepare MongoDB Database
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a new cluster (free tier is fine)
3. Create a database user with read/write permissions
4. Get your connection string (it looks like: `mongodb+srv://username:password@cluster.mongodb.net/database`)

### 1.2 Deploy on Render
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name:** `custom-form-builder-backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Root Directory:** Leave empty (root of repo)

### 1.3 Set Environment Variables in Render
Add these environment variables in Render dashboard:
- `NODE_ENV`: `production`
- `PORT`: `10000`
- `MONGODB_URI`: Your MongoDB connection string

### 1.4 Deploy Backend
1. Click "Create Web Service"
2. Wait for deployment to complete
3. Note your backend URL (e.g., `https://your-app-name.onrender.com`)

## Step 2: Deploy Frontend on Vercel

### 2.1 Prepare Frontend
1. Make sure your changes are pushed to GitHub
2. The `client/package.json` should have the fixed build scripts
3. The `client/vercel.json` should be properly configured

### 2.2 Deploy on Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset:** `Create React App`
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
   - **Install Command:** `npm install`

### 2.3 Set Environment Variables in Vercel
Add this environment variable:
- **Key:** `REACT_APP_API_URL`
- **Value:** Your Render backend URL (e.g., `https://your-app-name.onrender.com`)

### 2.4 Deploy Frontend
1. Click "Deploy"
2. Wait for deployment to complete
3. Note your frontend URL (e.g., `https://your-app-name.vercel.app`)

## Step 3: Update CORS Configuration

### 3.1 Update Backend CORS
Once you have your Vercel frontend URL, update the CORS configuration in `server.js`:

```javascript
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [
        'https://your-app-name.vercel.app', // Replace with your actual Vercel domain
        'https://your-custom-domain.com' // Replace with your custom domain if any
      ]
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
};
```

### 3.2 Redeploy Backend
1. Update the CORS configuration in your code
2. Push changes to GitHub
3. Render will automatically redeploy

## Step 4: Test Your Deployment

### 4.1 Test Backend
1. Visit: `https://your-backend-url.onrender.com/api/health`
2. Should return: `{"status":"OK","message":"Server is running","mongodb":"Connected"}`

### 4.2 Test Frontend
1. Visit your Vercel URL
2. Try creating a form
3. Test form submission
4. Check if data is saved to MongoDB

## Troubleshooting

### Common Issues:

1. **CORS Errors:**
   - Make sure your Vercel URL is in the CORS configuration
   - Check that environment variables are set correctly

2. **MongoDB Connection Issues:**
   - Verify your MongoDB connection string
   - Check if your IP is whitelisted in MongoDB Atlas

3. **Build Failures:**
   - Check the build logs in Vercel
   - Ensure all dependencies are in package.json

4. **Environment Variables:**
   - Double-check that `REACT_APP_API_URL` is set in Vercel
   - Verify `MONGODB_URI` is set in Render

### Useful Commands:

```bash
# Test backend locally
npm start

# Test frontend locally
cd client
npm start

# Check if build works locally
cd client
npm run build
```

## Final URLs

After deployment, you should have:
- **Backend:** `https://your-app-name.onrender.com`
- **Frontend:** `https://your-app-name.vercel.app`
- **Health Check:** `https://your-app-name.onrender.com/api/health`
