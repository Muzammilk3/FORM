@echo off
echo Starting Custom Form Builder...
echo.
echo Checking if Node.js is installed...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo Node.js is installed.
echo.
echo Installing backend dependencies...
npm install
if errorlevel 1 (
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b 1
)
echo.
echo Installing frontend dependencies...
cd client
npm install
if errorlevel 1 (
    echo ERROR: Failed to install frontend dependencies
    pause
    exit /b 1
)
cd ..
echo.
echo Starting the application...
echo Backend will run on http://localhost:5000
echo Frontend will run on http://localhost:3000
echo.
echo Starting backend server...
start "Backend Server" cmd /k "npm run dev"
echo Waiting for backend to start...
timeout /t 5 /nobreak >nul
echo.
echo Starting frontend client...
start "Frontend Client" cmd /k "npm run client"
echo.
echo Application started! Check the opened command windows.
echo.
echo If you see "Failed to fetch forms" error:
echo 1. Make sure the backend server is running on port 5000
echo 2. Check if MongoDB Atlas connection is working
echo 3. Try refreshing the page after a few seconds
echo.
pause

