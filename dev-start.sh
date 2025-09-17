#!/bin/bash

# LLM-Med Local Development Startup Script

echo "🚀 Starting LLM-Med Development Environment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop first."
    exit 1
fi

# Start PostgreSQL container
echo "📦 Starting PostgreSQL database..."
if docker ps | grep -q llm-med-postgres; then
    echo "✅ PostgreSQL container already running"
else
    if docker ps -a | grep -q llm-med-postgres; then
        echo "🔄 Starting existing PostgreSQL container..."
        docker start llm-med-postgres
    else
        echo "🆕 Creating new PostgreSQL container..."
        docker run --name llm-med-postgres \
          -e POSTGRES_PASSWORD=postgres \
          -e POSTGRES_USER=postgres \
          -e POSTGRES_DB=postgres \
          -p 5433:5432 \
          -d postgres:15
    fi
fi

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 3

# Set up database schema
echo "🗄️ Setting up database schema..."
npx prisma db push --skip-generate > /dev/null 2>&1

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate > /dev/null 2>&1

# Check if app is already running
if lsof -ti:3010 > /dev/null 2>&1; then
    echo "⚠️  App already running on port 3010"
    echo "🌐 Visit: http://localhost:3010"
else
    echo "🚀 Starting development server..."
    echo "🌐 App will be available at: http://localhost:3010"
    echo "🔧 Admin panel: http://localhost:3010/admin"
    echo "💚 Health check: http://localhost:3010/api/health"
    echo ""
    echo "Press Ctrl+C to stop the development server"
    npm run dev
fi
