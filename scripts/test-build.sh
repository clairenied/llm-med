#!/bin/bash

# Test build script to mimic Vercel environment
echo "🔍 Validating deployment configuration..."
./scripts/validate-deployment.sh
if [ $? -ne 0 ]; then
    echo "❌ Deployment validation failed!"
    exit 1
fi

echo "🧹 Cleaning build artifacts..."
rm -rf .next node_modules/.prisma

echo "📦 Installing dependencies..."
npm install

echo "🏗️  Building application..."
npm run build

echo "🔍 Checking Vercel configuration..."
if command -v vercel &> /dev/null; then
    echo "Running Vercel build validation..."
    vercel build --yes
else
    echo "⚠️  Vercel CLI not installed. Install with: npm i -g vercel"
    echo "   This would catch Vercel-specific configuration issues."
fi

echo "✅ Build test completed!"
