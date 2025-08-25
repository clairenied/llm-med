# Manuscript Review Tracker

A Next.js application for tracking academic manuscripts and their review process over time, inspired by the F1000Research model. This system provides transparency in the peer review process by organizing manuscripts, their versions, and associated reviews in a chronological, traceable format.

## Features

- **Manuscript Management**: Track manuscripts with title, authors, abstract, and keywords
- **Version Control**: Support for multiple manuscript versions (Word, PDF, Text, Free Text)
- **Review Tracking**: Organize reviews by version with internal/external distinction
- **Author Information**: Detailed author profiles with affiliations
- **Reviewer Management**: Anonymous reviewer system with coded identifiers (A, B, C, etc.)
- **Reference Links**: Integration with PubMed and F1000Research URLs
- **Status Tracking**: Manuscript status from draft to published

## Tech Stack

- **Frontend**: Next.js 15 with React 19, Tailwind CSS
- **Backend**: Next.js API routes
- **Database**: PostgreSQL with Prisma ORM
- **Development**: TypeScript, ESLint

## Getting Started

### Prerequisites

- Node.js 18+ 
- Docker (for PostgreSQL database)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd llm-med
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres"
   ```

4. **Start the database**
   ```bash
   # Start PostgreSQL with Docker
   docker compose up -d
   
   # Or if you have docker-compose installed:
   npm run docker:up
   ```

5. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   
   # Seed with sample data
   npm run db:seed
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open the application**
   Visit [http://localhost:3000](http://localhost:3000) to see the manuscript review tracker.

## Database Schema

The application uses the following main models:

- **Manuscript**: Core manuscript information with title, abstract, keywords, and status
- **Author**: Author details with name, email, and affiliation
- **ManuscriptVersion**: Version tracking with document URLs and types
- **Review**: Individual reviews linked to versions and reviewers
- **Reviewer**: Reviewer information with coded identifiers

## API Endpoints

- `GET /api/manuscripts` - List all manuscripts with versions and reviews
- `GET /api/manuscripts/[id]` - Get specific manuscript details
- `POST /api/manuscripts` - Create new manuscript
- `PUT /api/manuscripts/[id]` - Update manuscript

## Development Commands

```bash
# Development server
npm run dev

# Database operations
npm run db:generate    # Generate Prisma client
npm run db:push       # Push schema changes
npm run db:migrate    # Run migrations
npm run db:seed       # Seed sample data
npm run db:studio     # Open Prisma Studio
npm run db:reset      # Reset database

# Docker operations
npm run docker:up     # Start PostgreSQL
npm run docker:down   # Stop PostgreSQL
npm run docker:logs   # View database logs

# Build and deployment
npm run build
npm run start
npm run lint
```

## Project Structure

```
src/
├── app/
│   ├── api/manuscripts/     # API routes
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── components/
│   ├── ManuscriptRecord.tsx    # Main record component
│   ├── ManuscriptInfo.tsx      # Manuscript details
│   ├── VersionTracker.tsx      # Version management
│   └── ReviewTracker.tsx       # Review timeline
└── lib/
    └── prisma.ts           # Database client

prisma/
├── schema.prisma           # Database schema
└── seed.ts                # Sample data
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.
