#!/bin/bash

# Test build script to mimic Vercel environment
echo "🧹 Cleaning build artifacts..."
rm -rf .next node_modules/.prisma

echo "📦 Installing dependencies..."
npm install

echo "🏗️  Building application..."
npm run build

echo "✅ Build test completed!"
