# Custom Form Builder

A MERN stack application for creating interactive forms with drag & drop, cloze, and comprehension questions.

## Quick Start

1. **Run the application:**
   ```bash
   # Windows
   start.bat
   
   # Or manually
   npm install
   cd client && npm install && cd ..
   npm run dev
   ```

2. **Open your browser:**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

## Troubleshooting "Failed to fetch forms" Error

### 1. Check if Backend Server is Running
- Open http://localhost:5000/api/health in your browser
- You should see: `{"status":"OK","message":"Server is running","mongodb":"Connected"}`
- If you get "Connection refused", the backend server is not running

### 2. Start Backend Server
```bash
npm run dev
```
You should see:
```
Server running on port 5000
Health check: http://localhost:5000/api/health
Connected to MongoDB Atlas
```

### 3. Check MongoDB Connection
- If you see "MongoDB connection error", check your internet connection
- The app uses MongoDB Atlas cloud database
- Connection string is in `.env` file

### 4. Check Frontend Console
- Open browser developer tools (F12)
- Go to Console tab
- Look for any error messages

### 5. Common Solutions
- **Refresh the page** after backend starts
- **Wait 10-15 seconds** for MongoDB connection
- **Check firewall** - allow Node.js through firewall
- **Restart the application** using `start.bat`

### 6. Manual Start (if start.bat doesn't work)
```bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend  
cd client
npm start
```

## Features
- Create forms with multiple question types
- Drag & drop categorization
- Fill-in-the-blank questions
- Comprehension questions with multiple choice
- Form responses and analytics
- Export responses to CSV

## Tech Stack
- **Frontend:** React, Tailwind CSS, Axios
- **Backend:** Node.js, Express, MongoDB
- **Database:** MongoDB Atlas (Cloud)


