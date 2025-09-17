# Local Development Setup Guide

## 🚀 Quick Start

Your Next.js app is already running, but we need to set up the database. Here's how to get everything working locally:

## 📋 Prerequisites

Make sure you have installed:
- ✅ **Node.js** (v18 or higher)
- ✅ **npm** or **yarn**
- 🔲 **Docker** (for local database)
- 🔲 **PostgreSQL** (alternative to Docker)

## 🗄️ Database Setup Options

### Option 1: Docker PostgreSQL (Recommended)

**Start PostgreSQL with Docker:**
```bash
# Start PostgreSQL container
docker run --name llm-med-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_DB=postgres \
  -p 5433:5432 \
  -d postgres:15

# Verify it's running
docker ps
```

### Option 2: Local PostgreSQL Installation

**If you prefer local PostgreSQL:**
```bash
# macOS with Homebrew
brew install postgresql@15
brew services start postgresql@15

# Create database
createdb -p 5433 postgres
```

### Option 3: Cloud Database (Easiest)

**Use a free cloud database:**
- **Neon** (recommended): https://neon.tech
- **Supabase**: https://supabase.com
- **Railway**: https://railway.app

## ⚙️ Environment Configuration

**Your `.env` file should have:**
```bash
# Database - Use one of these:
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/postgres"  # Local
# DATABASE_URL="your-cloud-database-url"  # Cloud option

# NextAuth.js
NEXTAUTH_URL="http://localhost:3010"
NEXTAUTH_SECRET="dev-secret-key-change-in-production-12345"

# Admin Creation Token
ADMIN_CREATION_TOKEN="admin-token-12345"
```

## 🔧 Setup Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Database
```bash
# If using Docker:
docker start llm-med-postgres

# If using local PostgreSQL:
brew services start postgresql@15
```

### 3. Setup Database Schema
```bash
# Generate Prisma client and push schema
npx prisma generate
npx prisma db push

# Optional: Seed with sample data
npx prisma db seed
```

### 4. Start Development Server
```bash
npm run dev
```

## 🌐 Access Your App

- **Main App**: http://localhost:3010
- **Health Check**: http://localhost:3010/api/health
- **Admin Panel**: http://localhost:3010/admin (after creating admin user)

## 👤 Create Admin User

**After the app is running:**
```bash
# Create your first admin user
curl -X POST http://localhost:3010/api/admin/create-admin \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer admin-token-12345" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

## 🔍 Verify Everything Works

### 1. Check Health
```bash
curl http://localhost:3010/api/health
```
Should return: `{"status":"healthy"}`

### 2. Sign In
- Go to http://localhost:3010
- Sign in with your admin credentials
- Should redirect to manuscript list

### 3. Test Admin Features
- Go to http://localhost:3010/admin
- Try creating invitations
- Test manuscript upload

## 🛠️ Development Workflow

### Database Management
```bash
# View database in browser
npx prisma studio

# Reset database (careful!)
npx prisma db push --force-reset

# Generate Prisma client after schema changes
npx prisma generate
```

### Useful Scripts
```bash
# Development server
npm run dev

# Build for production
npm run build

# Run production build locally
npm start

# Database operations
npm run db:push
npm run db:seed
npm run db:studio
```

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check if PostgreSQL is running
docker ps  # For Docker
brew services list | grep postgresql  # For Homebrew

# Test database connection
psql -h localhost -p 5433 -U postgres -d postgres
```

### Port Already in Use
```bash
# Kill process on port 3010
lsof -ti:3010 | xargs kill -9

# Or use different port
npm run dev -- --port 3011
```

### Prisma Issues
```bash
# Regenerate Prisma client
rm -rf node_modules/.prisma
npx prisma generate

# Reset and recreate database
npx prisma db push --force-reset
```

## 📁 Project Structure

```
llm-med/
├── src/
│   ├── app/                 # Next.js App Router pages
│   ├── components/          # React components
│   ├── lib/                 # Utilities (auth, prisma)
│   └── types/               # TypeScript types
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── seed.ts              # Sample data
├── scripts/                 # Utility scripts
└── public/                  # Static assets
```

## 🎯 Next Steps

1. **Start database** (Docker or cloud)
2. **Run `npx prisma db push`** to set up schema
3. **Create admin user** with the curl command above
4. **Sign in and start developing!**

---

**Your development environment should now be fully functional!** 🚀
