#!/bin/bash

# Production Deployment Script for LLM-Med Review Tracker
# This script handles database migrations and deployment to production

set -e  # Exit on any error

echo "🚀 Starting production deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if required environment variables are set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ Error: DATABASE_URL environment variable is not set."
    echo "Please set your production database URL."
    exit 1
fi

if [ -z "$NEXTAUTH_SECRET" ]; then
    echo "❌ Error: NEXTAUTH_SECRET environment variable is not set."
    echo "Please set a secure secret for NextAuth.js."
    exit 1
fi

if [ -z "$NEXTAUTH_URL" ]; then
    echo "❌ Error: NEXTAUTH_URL environment variable is not set."
    echo "Please set your production URL (e.g., https://your-domain.com)."
    exit 1
fi

echo "✅ Environment variables validated"

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Run database migrations
echo "🗄️  Running database migrations..."
npx prisma migrate deploy

# Check if admin user exists, create if not
echo "👤 Checking for admin user..."
node -e "
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function ensureAdminUser() {
  const prisma = new PrismaClient();
  
  try {
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@example.com' }
    });
    
    if (!adminUser) {
      console.log('Creating admin user...');
      const hashedPassword = await bcrypt.hash('admin123', 12);
      
      await prisma.user.create({
        data: {
          email: 'admin@example.com',
          name: 'Administrator',
          password: hashedPassword,
          role: 'ADMIN'
        }
      });
      
      console.log('✅ Admin user created: admin@example.com / admin123');
      console.log('⚠️  Please change the password after first login!');
    } else {
      console.log('✅ Admin user already exists');
    }
  } catch (error) {
    console.error('❌ Error checking/creating admin user:', error);
    process.exit(1);
  } finally {
    await prisma.\$disconnect();
  }
}

ensureAdminUser();
"

# Build the application
echo "🏗️  Building application..."
npm run build

echo "✅ Production deployment completed successfully!"
echo ""
echo "🎉 Your LLM-Med Review Tracker is ready for production!"
echo ""
echo "📋 Next steps:"
echo "1. Start your production server: npm start"
echo "2. Visit your application and sign in with:"
echo "   📧 Email: admin@example.com"
echo "   🔑 Password: admin123"
echo "3. ⚠️  IMPORTANT: Change the admin password immediately!"
echo "4. Create additional users as needed"
echo ""
echo "🔧 Available commands:"
echo "   npm run scrape:quick  - Quick F1000 scraping (3 pages)"
echo "   npm run scrape:bulk   - Standard scraping (10 pages)"
echo "   npm run scrape:deep   - Deep scraping (20 pages)"
echo ""
