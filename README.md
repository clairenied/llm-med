# Manuscript Review Tracker

Academic manuscript review tracking system with transparent peer review process, version control, and admin management.

## 🚀 Quick Start

```bash
# Clone and install
git clone git@github.com:clairenied/llm-med.git
# Or `gh repo clone clairenied/llm-med`
cd llm-med
npm install

# Start database
docker compose up -d

# Setup database
cp .env.example .env
npm run db:push
npm run db:seed

# Start development server
npm run dev
```

Visit [http://localhost:3010](http://localhost:3010)

## ✨ Features

- **Manuscript Management** - Track manuscripts with versions and reviews
- **Admin Dashboard** - User management, data import, article cleanup
- **Review System** - Internal/external reviews with anonymous reviewers
- **Version Control** - Multiple manuscript versions (PDF, Word, Text)
- **Data Import** - Bulk import from external sources (F1000Research)
- **Invitation System** - Admin-controlled user registration
- **Role-Based Access** - Admin, Reviewer, Author permissions

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Next.js API routes, NextAuth.js
- **Database**: PostgreSQL, Prisma ORM
- **Development**: TypeScript, ESLint

## 📋 Prerequisites

- Node.js 18+
- Docker (for PostgreSQL)
- npm/yarn

## 🗄️ Database Commands

```bash
npm run db:generate    # Generate Prisma client
npm run db:push       # Push schema to database
npm run db:migrate    # Run migrations
npm run db:seed       # Add sample data
npm run db:studio     # Open database GUI
npm run db:reset      # Reset database
```

## 🐳 Docker Commands

```bash
npm run docker:up     # Start PostgreSQL
npm run docker:down   # Stop PostgreSQL
npm run docker:logs   # View database logs
```

## 🔧 Development Commands

```bash
npm run dev           # Development server (port 3010)
npm run build         # Production build
npm run start         # Production server
npm run lint          # Run ESLint
```

## 🗂️ Project Structure

```
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── admin/             # Admin dashboard
│   │   ├── api/               # API endpoints
│   │   ├── auth/              # Authentication pages
│   │   └── manuscripts/       # Manuscript management
│   ├── components/            # React components
│   ├── lib/                   # Utilities (auth, database)
│   └── types/                 # TypeScript definitions
├── prisma/                    # Database schema & migrations
├── database-ops/             # Database & deployment operations
├── config/                    # Configuration files
├── dev-tools/                # Development utilities
└── docs/                      # Documentation
```

## 🔐 Authentication

- **Invitation-only registration** - Admins send invitations
- **Role-based access** - Admin, Reviewer, Author roles
- **NextAuth.js** - Secure session management

## 📊 Database Schema

Core models: Manuscript → ManuscriptVersion → Review

- **Manuscript**: Title, abstract, keywords, status
- **Author**: Author information and affiliations
- **ManuscriptVersion**: Version tracking with documents
- **Review**: Reviews linked to versions and reviewers
- **Reviewer**: Anonymous reviewer system (A, B, C codes)
- **User/Session**: Authentication system
- **Invitation**: Invitation-only registration

## 🌐 API Endpoints

```
GET    /api/manuscripts        # List manuscripts
GET    /api/manuscripts/[id]   # Get manuscript
POST   /api/manuscripts        # Create manuscript
PUT    /api/manuscripts/[id]   # Update manuscript

GET    /api/admin/users        # List users (admin)
POST   /api/admin/invitations  # Send invitation (admin)
POST   /api/admin/scrape       # Scrape articles (admin)
```

## 🚀 Deployment

See `docs/DEPLOYMENT.md` for complete deployment guide.

### Environment Variables

```bash
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="https://your-domain.com"

# Optional: For password reset emails
RESEND_API_KEY="your-resend-api-key"
FROM_EMAIL="noreply@yourdomain.com"
```

## 📝 Development Setup

See `LOCAL_DEVELOPMENT.md` for detailed setup instructions.

## 📧 Email Setup (Optional)

Password reset emails are handled by [Resend](https://resend.com). To enable email functionality:

1. **Sign up for Resend** at [resend.com](https://resend.com)
2. **Get your API key** from the Resend dashboard
3. **Add to environment variables**:
   ```bash
   RESEND_API_KEY="your-resend-api-key"
   FROM_EMAIL="noreply@yourdomain.com"
   ```
4. **Verify your domain** in Resend (for production)

**Without email setup**: Reset links are displayed on the forgot password page for development.

## 🧹 Data Management

```bash
npm run cleanup:fake-data      # Remove test data
npm run cleanup:duplicates     # Remove duplicate records
npm run scrape:bulk           # Import from F1000Research
```

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Follow cursor rules in `.cursor/workspace/`
4. Submit pull request

## 📄 License

MIT License
