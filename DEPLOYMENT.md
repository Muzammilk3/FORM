# 🚀 Deployment Guide: Custom Form Builder

This guide will help you deploy your Custom Form Builder application on **Render** (Backend) and **Vercel** (Frontend).

## 📋 Prerequisites

1. **GitHub Account** - Your code should be on GitHub
2. **Render Account** - [render.com](https://render.com)
3. **Vercel Account** - [vercel.com](https://vercel.com)
4. **MongoDB Atlas** - [mongodb.com/atlas](https://mongodb.com/atlas)

---

## 🔧 Backend Deployment on Render

### Step 1: Prepare MongoDB Atlas
1. Create a MongoDB Atlas cluster
2. Get your connection string
3. Add your IP to the whitelist (or use 0.0.0.0/0 for all IPs)

### Step 2: Deploy on Render
1. **Sign up/Login** to [render.com](https://render.com)
2. **Connect your GitHub repository**
3. **Create a new Web Service**
   - **Name**: `custom-form-builder-backend`
   - **Repository**: Select your GitHub repo
   - **Branch**: `main`
   - **Root Directory**: Leave empty (root)
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### Step 3: Configure Environment Variables
Add these environment variables in Render:

**⚠️ Security Note**: Never commit real credentials to your repository. Use environment variables in your deployment platform.

```env
NODE_ENV=production
PORT=10000
MONGODB_URI=YOUR_MONGODB_CONNECTION_STRING_HERE
```

**To get your MongoDB Atlas connection string:**
1. Go to MongoDB Atlas Dashboard
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `YOUR_MONGODB_CONNECTION_STRING_HERE` with your actual MongoDB connection string

### Step 4: Deploy
- Click **Create Web Service**
- Wait for deployment to complete
- Note your backend URL: `https://your-app-name.onrender.com`

---

## 🎨 Frontend Deployment on Vercel

### Step 1: Deploy on Vercel
1. **Sign up/Login** to [vercel.com](https://vercel.com)
2. **Import your GitHub repository**
3. **Configure project**:
   - **Framework Preset**: `Create React App`
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

### Step 2: Configure Environment Variables
Add these environment variables in Vercel:

```env
REACT_APP_API_URL=https://your-backend-domain.onrender.com
```

### Step 3: Deploy
- Click **Deploy**
- Wait for deployment to complete
- Note your frontend URL: `https://your-app-name.vercel.app`

---

## 🔄 Update Backend CORS

After getting your Vercel domain, update the CORS configuration in `server.js`:

```javascript
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [
        'https://your-app-name.vercel.app', // Replace with your actual Vercel domain
        'https://your-custom-domain.com' // Add custom domain if any
      ]
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
};
```

Then redeploy your backend on Render.

---

## 🔍 Testing Your Deployment

### Backend Health Check
Visit: `https://your-backend-domain.onrender.com/api/health`
Should return:
```json
{
  "status": "OK",
  "message": "Server is running",
  "mongodb": "Connected"
}
```

### Frontend Test
1. Visit your Vercel domain
2. Create a new form
3. Test all features
4. Check if images upload correctly

---

## 🔒 Security Best Practices

### Environment Variables
- ✅ **Never commit real credentials** to your repository
- ✅ **Use environment variables** in your deployment platform
- ✅ **Use placeholder values** in documentation (like `YOUR_MONGODB_CONNECTION_STRING_HERE`)
- ✅ **Enable secret scanning** in GitHub repository settings

### MongoDB Atlas Security
- ✅ **Enable IP whitelist** or use VPC peering
- ✅ **Use database users** with minimal required permissions
- ✅ **Enable audit logging** for production databases

---

## 🛠️ Troubleshooting

### GitHub Security Alerts
If you see a "MongoDB Atlas Database URI with credentials" alert:
1. **Check if real credentials were committed** - Look for actual usernames/passwords
2. **If only placeholders exist** - The alert is a false positive, you can safely close it
3. **If real credentials were found** - Rotate your MongoDB password immediately
4. **Close the alert** - Mark as "Closed as revoked" after fixing

### Common Issues:

#### 1. CORS Errors
- Check if your frontend domain is in the backend CORS configuration
- Ensure environment variables are set correctly

#### 2. MongoDB Connection Issues
- Verify your MongoDB Atlas connection string
- Check if your IP is whitelisted
- Ensure network access is configured correctly

#### 3. Build Failures
- Check if all dependencies are in `package.json`
- Verify Node.js version compatibility
- Check build logs for specific errors

---

## 🎉 Success!

Your Custom Form Builder is now deployed and accessible worldwide! 

**Frontend**: `https://your-app-name.vercel.app`
**Backend**: `https://your-app-name.onrender.com`

Share your form builder with the world! 🌍
