# Vercel Environment Variables Checklist

## 🚨 Quick Fix for Deployment Error

Your deployment is failing because environment variables are missing in Vercel. Here's exactly what you need to do:

## ✅ Required Environment Variables

**Go to your Vercel Dashboard → Project → Settings → Environment Variables**

Add these **3 required variables**:

### 1. Database Connection
```
Name: DATABASE_URL
Value: your-production-database-connection-string
Environment: Production (and Preview if needed)
```

### 2. NextAuth URL
```
Name: NEXTAUTH_URL  
Value: https://your-app-name.vercel.app
Environment: Production (and Preview if needed)
```

### 3. NextAuth Secret
```
Name: NEXTAUTH_SECRET
Value: a-long-random-secure-string-32-characters-minimum
Environment: Production (and Preview if needed)
```

### 4. Admin Token
```
Name: ADMIN_CREATION_TOKEN
Value: your-secure-admin-token-for-creating-first-admin
Environment: Production (and Preview if needed)
```

### 5. Cron Secret (Optional)
```
Name: CRON_SECRET
Value: your-secure-cron-secret-for-daily-scraping
Environment: Production (and Preview if needed)
```
**Note:** This is optional - only needed if you want to use the daily scraping cron job.

## 🎯 Step-by-Step Instructions:

### Step 1: Get Your Database URL
- If using **Neon**: Go to Neon dashboard → Connection string
- If using **Supabase**: Go to Settings → Database → Connection string
- If using **Railway**: Go to your database service → Connect tab
- Format: `postgresql://username:password@host:port/database`

### Step 2: Set NEXTAUTH_URL
- This should be your Vercel app URL
- Example: `https://llm-med.vercel.app` (replace with your actual domain)
- **Important**: Use `https://` not `http://`

### Step 3: Generate NEXTAUTH_SECRET
- Use a secure random string generator
- Minimum 32 characters
- Example: `openssl rand -base64 32` (run this in terminal)

### Step 4: Set Admin Token
- Create a secure token for admin user creation
- Example: `admin-secure-token-12345-change-this`

## 🚀 After Setting Variables:

1. **Save all variables** in Vercel dashboard
2. **Go to Deployments tab**
3. **Click "Redeploy"** on the latest deployment
4. **Wait for deployment to complete**

## 🔍 Verification:

After successful deployment:
- Visit your app URL
- Check `/api/health` endpoint works
- Try signing in
- Test creating invitations

## 💡 Common Issues:

- **DATABASE_URL**: Make sure it's the production database, not localhost
- **NEXTAUTH_URL**: Must match your actual Vercel domain exactly
- **NEXTAUTH_SECRET**: Must be long and secure (32+ characters)
- **Environment**: Make sure variables are set for "Production" environment

## 🆘 Still Having Issues?

1. Check Vercel build logs for specific error messages
2. Verify database is accessible from Vercel
3. Test each environment variable is correctly set
4. Make sure no typos in variable names

---

**Once you set these 4 environment variables, your deployment should succeed!** 🚀
