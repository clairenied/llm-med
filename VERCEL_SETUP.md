# Vercel Deployment Setup Guide

## 🚨 Build Error Fixed!

The TypeScript build error has been resolved. Your deployment should now succeed once you set up the required environment variables.

## 📋 Required Environment Variables

Set these in your Vercel Dashboard → Project Settings → Environment Variables:

### 🔐 **Production Environment Variables**

```bash
# Database (Required)
DATABASE_URL=your-production-database-url

# NextAuth.js (Required)
NEXTAUTH_URL=https://your-app-domain.vercel.app
NEXTAUTH_SECRET=your-secure-production-secret-key

# Admin Creation (Required)
ADMIN_CREATION_TOKEN=your-secure-admin-token
```

## 🎯 **Step-by-Step Setup:**

### 1. **Database Setup**
- Use a production PostgreSQL database (Neon, Supabase, Railway, etc.)
- Get your `DATABASE_URL` connection string
- Format: `postgresql://username:password@host:port/database`

### 2. **NextAuth Configuration**
- `NEXTAUTH_URL`: Your Vercel app URL (e.g., `https://llm-med.vercel.app`)
- `NEXTAUTH_SECRET`: Generate a secure random string (32+ characters)

### 3. **Admin Token**
- `ADMIN_CREATION_TOKEN`: Secure token for creating admin users
- Use a strong, unique value


## 🚀 **Deployment Steps:**

1. **Go to Vercel Dashboard**
   - Navigate to your project
   - Go to Settings → Environment Variables

2. **Add Each Variable**
   - Click "Add New"
   - Set Environment: "Production" (and "Preview" if needed)
   - Add the 3 required variables above

3. **Redeploy**
   - Go to Deployments tab
   - Click "Redeploy" on the latest deployment
   - Or push a new commit to trigger deployment

## ✅ **Verification:**

After deployment succeeds:
1. Visit your app URL
2. Check `/api/health` endpoint works
3. Try signing in
4. Test admin functions

## 🔧 **Database Migration:**

If using a new database, run:
```bash
npx prisma db push
```

Or set up migrations in your production database.


## 🆘 **Troubleshooting:**

- **Build fails**: Check build logs for specific errors
- **Database errors**: Verify `DATABASE_URL` is correct
- **Auth issues**: Check `NEXTAUTH_URL` and `NEXTAUTH_SECRET`
- **500 errors**: Check server logs in Vercel dashboard

## 🎯 **Manual Invitation Sharing:**

The app uses manual invitation sharing:
- Invitations are created in database
- Signup links shown in admin interface
- Copy and share links manually (Slack, text, etc.)
- No email service required

---

**The build error is fixed - your deployment should succeed once the 3 environment variables are set!** 🚀
