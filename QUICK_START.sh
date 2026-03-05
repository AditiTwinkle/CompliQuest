#!/bin/bash

# CompliQuest Quick Start Script
# This script sets up and runs CompliQuest locally

set -e

echo "🚀 CompliQuest Local Setup"
echo "=========================="
echo ""

# Check Node.js version
echo "✓ Checking Node.js version..."
NODE_VERSION=$(node -v)
echo "  Node.js: $NODE_VERSION"

# Check npm version
echo "✓ Checking npm version..."
NPM_VERSION=$(npm -v)
echo "  npm: $NPM_VERSION"

# Install dependencies
echo ""
echo "✓ Installing dependencies..."
npm install

# Create environment files if they don't exist
echo ""
echo "✓ Setting up environment variables..."

if [ ! -f "backend/.env" ]; then
  echo "  Creating backend/.env..."
  cp backend/.env.example backend/.env
fi

if [ ! -f "frontend/.env.local" ]; then
  echo "  Creating frontend/.env.local..."
  cp frontend/.env.example frontend/.env.local
  echo "VITE_API_URL=http://localhost:3000" >> frontend/.env.local
fi

# Build backend
echo ""
echo "✓ Building backend..."
npm run build:backend

# Build frontend
echo ""
echo "✓ Building frontend..."
npm run build:frontend

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "  1. Start backend:  npm run dev:backend"
echo "  2. Start frontend: npm run dev:frontend"
echo ""
echo "🌐 Access the app:"
echo "  Frontend: http://localhost:5173"
echo "  Backend:  http://localhost:3000"
echo "  Health:   http://localhost:3000/health"
echo ""
echo "📚 For more info, see LOCAL_SETUP.md"
