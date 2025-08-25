#!/bin/bash

# Comprehensive deployment test script
# Tests build process and validates Vercel configuration

set -e  # Exit on any error

echo "🚀 Starting comprehensive deployment test..."
echo

# =============================================================================
# CONFIGURATION VALIDATION
# =============================================================================
echo "🔍 Step 1: Validating deployment configuration..."

# Check if vercel.json exists and validate basic structure
if [ -f "vercel.json" ]; then
    echo "✅ vercel.json found"
    
    # Basic JSON validation
    if jq empty vercel.json 2>/dev/null; then
        echo "✅ vercel.json is valid JSON"
    else
        echo "❌ vercel.json contains invalid JSON"
        exit 1
    fi
    
    # Check for common Next.js App Router issues
    if jq -e '.functions | has("src/app/api/**/*.ts")' vercel.json 2>/dev/null; then
        echo "❌ Found problematic function pattern for App Router: src/app/api/**/*.ts"
        echo "   App Router API routes are automatically handled by Vercel"
        exit 1
    fi
    
    # Check for pages router patterns that might conflict
    if jq -e '.functions | keys[]' vercel.json 2>/dev/null | grep -q "pages/api"; then
        echo "⚠️  Found Pages Router API patterns - ensure you're using the correct router"
    fi
    
else
    echo "ℹ️  No vercel.json found (optional for Next.js)"
fi

# Check package.json for required scripts
if ! jq -e '.scripts.build' package.json >/dev/null; then
    echo "❌ Missing build script in package.json"
    exit 1
fi

# Check if Prisma is properly configured for builds
if jq -e '.dependencies."@prisma/client"' package.json >/dev/null; then
    echo "✅ @prisma/client dependency found"
    
    if jq -e '.scripts.build' package.json | grep -q "prisma generate"; then
        echo "✅ Build script includes prisma generate"
    else
        echo "⚠️  Build script doesn't include 'prisma generate' - this may cause deployment issues"
    fi
    
    if jq -e '.scripts.postinstall' package.json | grep -q "prisma generate"; then
        echo "✅ postinstall script includes prisma generate"
    else
        echo "⚠️  No postinstall script with 'prisma generate' found"
    fi
fi

echo "✅ Configuration validation completed!"
echo

# =============================================================================
# BUILD ENVIRONMENT SETUP
# =============================================================================
echo "🧹 Step 2: Cleaning build environment..."

# Clean build artifacts to mimic fresh deployment
rm -rf .next node_modules/.prisma

echo "✅ Build artifacts cleaned"
echo

# =============================================================================
# DEPENDENCY INSTALLATION
# =============================================================================
echo "📦 Step 3: Installing dependencies..."

npm install

echo "✅ Dependencies installed"
echo

# =============================================================================
# BUILD PROCESS
# =============================================================================
echo "🏗️  Step 4: Building application..."

npm run build

echo "✅ Build completed successfully"
echo

# =============================================================================
# VERCEL CLI VALIDATION (OPTIONAL)
# =============================================================================
echo "🔍 Step 5: Vercel CLI validation..."

if command -v vercel &> /dev/null; then
    echo "Running Vercel build validation..."
    vercel build --yes
    echo "✅ Vercel CLI validation passed"
else
    echo "⚠️  Vercel CLI not installed. Install with: npm i -g vercel"
    echo "   This would provide additional Vercel-specific validation."
fi

echo

# =============================================================================
# SUMMARY
# =============================================================================
echo "🎉 Deployment test completed successfully!"
echo
echo "Summary:"
echo "✅ Configuration validated"
echo "✅ Dependencies installed"
echo "✅ Build process completed"
echo "✅ Ready for Vercel deployment"
echo
echo "To deploy to Vercel:"
echo "  vercel --prod"
echo
echo "To run this test again:"
echo "  ./scripts/deploy-test.sh"
