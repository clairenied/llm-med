# 🚀 Production Deployment Guide

This guide covers deploying the LLM-Med Review Tracker to production environments.

## 📋 Prerequisites

### Required Environment Variables

Create a `.env.production` file or set these environment variables:

```bash
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# Authentication
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-super-secure-secret-key-change-this"

# Optional: For development/staging
NODE_ENV="production"
```

### System Requirements

- Node.js 18+ 
- PostgreSQL 12+
- npm or yarn
- Git

## 🗄️ Database Setup

### 1. Create Production Database

```sql
-- Connect to PostgreSQL as superuser
CREATE DATABASE llm_med_production;
CREATE USER llm_med_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE llm_med_production TO llm_med_user;
```

### 2. Set Database URL

```bash
export DATABASE_URL="postgresql://llm_med_user:secure_password@localhost:5432/llm_med_production"
```

## 🚀 Deployment Methods

### Method 1: Automated Script (Recommended)

```bash
# Clone the repository
git clone <your-repo-url>
cd llm-med

# Set environment variables
export DATABASE_URL="your-production-database-url"
export NEXTAUTH_SECRET="your-secure-secret"
export NEXTAUTH_URL="https://your-domain.com"

# Run deployment script
./scripts/deploy-production.sh
```

### Method 2: Manual Deployment

```bash
# 1. Install dependencies
npm ci --only=production

# 2. Generate Prisma client
npx prisma generate

# 3. Run migrations
npx prisma migrate deploy

# 4. Create admin user (optional)
tsx scripts/create-admin.ts

# 5. Build application
npm run build

# 6. Start production server
npm start
```

### Method 3: Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build application
RUN npm run build

# Expose port
EXPOSE 3000

# Start application
CMD ["npm", "start"]
```

```bash
# Build and run with Docker
docker build -t llm-med .
docker run -p 3000:3000 \
  -e DATABASE_URL="your-db-url" \
  -e NEXTAUTH_SECRET="your-secret" \
  -e NEXTAUTH_URL="https://your-domain.com" \
  llm-med
```

## 🌐 Platform-Specific Deployments

### Vercel

1. **Connect Repository**: Link your GitHub/GitLab repo to Vercel
2. **Environment Variables**: Add in Vercel dashboard:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET` 
   - `NEXTAUTH_URL`
3. **Build Settings**:
   - Build Command: `npm run build`
   - Output Directory: `.next`
4. **Deploy**: Vercel will auto-deploy on git push

### Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and create project
railway login
railway init

# Set environment variables
railway variables set DATABASE_URL="your-db-url"
railway variables set NEXTAUTH_SECRET="your-secret"
railway variables set NEXTAUTH_URL="https://your-app.railway.app"

# Deploy
railway up
```

### DigitalOcean App Platform

1. **Create App**: Connect your repository
2. **Environment Variables**: Add in dashboard
3. **Build Command**: `npm run build`
4. **Run Command**: `npm start`

## 🔧 Post-Deployment Setup

### 1. Initial Admin User

The deployment script creates an admin user:
- **Email**: `admin@example.com`
- **Password**: `admin123`

⚠️ **CRITICAL**: Change this password immediately after first login!

### 2. Create Additional Users

Use the admin panel at `/admin/users` to:
- Create reviewer accounts
- Create author accounts  
- Manage user roles

### 3. Data Import

#### Programmatic Scraping
```bash
# Quick test (3 pages)
npm run scrape:quick

# Standard import (10 pages)
npm run scrape:bulk

# Comprehensive import (20 pages)  
npm run scrape:deep

# Custom configuration
tsx scripts/run-bulk-scraper.ts --pages 15 --delay 2500
```

#### Manual Data Import
- Use the `/import` page for CSV/JSON uploads
- Follow the format guidelines in the UI

## 🔒 Security Checklist

### Environment Variables
- [ ] `NEXTAUTH_SECRET` is cryptographically secure (32+ characters)
- [ ] `DATABASE_URL` uses strong password
- [ ] No sensitive data in git repository

### Database Security
- [ ] Database user has minimal required permissions
- [ ] Database is not publicly accessible
- [ ] Regular backups are configured
- [ ] SSL/TLS encryption enabled

### Application Security
- [ ] Admin password changed from default
- [ ] HTTPS enabled in production
- [ ] Rate limiting configured (if needed)
- [ ] Regular security updates applied

## 📊 Monitoring & Maintenance

### Health Checks

```bash
# Check application status
curl https://your-domain.com/api/health

# Check database connectivity
npx prisma db execute --stdin <<< "SELECT 1;"
```

### Backup Strategy

```bash
# Database backup
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# Restore from backup
psql $DATABASE_URL < backup-20241201.sql
```

### Log Monitoring

Monitor these key areas:
- Application errors in server logs
- Database connection issues
- Authentication failures
- Scraping job failures

## 🔄 Updates & Migrations

### Updating the Application

```bash
# Pull latest changes
git pull origin main

# Install new dependencies
npm ci --only=production

# Run new migrations
npx prisma migrate deploy

# Rebuild application
npm run build

# Restart server
pm2 restart llm-med  # or your process manager
```

### Database Migrations

```bash
# Check migration status
npx prisma migrate status

# Apply pending migrations
npx prisma migrate deploy

# Reset database (⚠️ DESTRUCTIVE)
npx prisma migrate reset --force
```

## 🆘 Troubleshooting

### Common Issues

#### Migration Errors
```bash
# Check current schema state
npx prisma db pull
npx prisma migrate diff --from-schema-datamodel prisma/schema.prisma --to-schema-datasource

# Force reset (⚠️ loses data)
npx prisma migrate reset --force
```

#### Authentication Issues
- Verify `NEXTAUTH_URL` matches your domain
- Check `NEXTAUTH_SECRET` is set and secure
- Ensure database user table exists

#### Performance Issues
- Monitor database query performance
- Check server resource usage
- Consider implementing caching
- Optimize scraping frequency

### Getting Help

1. Check application logs
2. Verify environment variables
3. Test database connectivity
4. Review migration status
5. Check GitHub issues

## 📞 Support

For deployment issues:
1. Check this documentation
2. Review error logs
3. Verify environment setup
4. Test with minimal configuration

---

**🎉 Congratulations!** Your LLM-Med Review Tracker should now be running in production.

Remember to:
- Change default passwords
- Set up monitoring
- Configure backups
- Keep dependencies updated
