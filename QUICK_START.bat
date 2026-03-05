@echo off
REM CompliQuest Quick Start Script for Windows
REM This script sets up and runs CompliQuest locally

echo.
echo 🚀 CompliQuest Local Setup
echo ==========================
echo.

REM Check Node.js version
echo ✓ Checking Node.js version...
node -v

REM Check npm version
echo ✓ Checking npm version...
npm -v

REM Install dependencies
echo.
echo ✓ Installing dependencies...
call npm install

REM Create environment files if they don't exist
echo.
echo ✓ Setting up environment variables...

if not exist "backend\.env" (
  echo   Creating backend\.env...
  copy backend\.env.example backend\.env
)

if not exist "frontend\.env.local" (
  echo   Creating frontend\.env.local...
  copy frontend\.env.example frontend\.env.local
  echo VITE_API_URL=http://localhost:3000 >> frontend\.env.local
)

REM Build backend
echo.
echo ✓ Building backend...
call npm run build:backend

REM Build frontend
echo.
echo ✓ Building frontend...
call npm run build:frontend

echo.
echo ✅ Setup complete!
echo.
echo 📝 Next steps:
echo   1. Start backend:  npm run dev:backend
echo   2. Start frontend: npm run dev:frontend
echo.
echo 🌐 Access the app:
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:3000
echo   Health:   http://localhost:3000/health
echo.
echo 📚 For more info, see LOCAL_SETUP.md
echo.
pause
