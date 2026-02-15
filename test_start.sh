#!/bin/bash
# Start the LLM-Med dev environment

# Switch to Node 20 (required — Node 22+ breaks the dev server)
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 20

# Start Postgres container
docker-compose up -d

# Wait for Postgres to be ready
echo "Waiting for Postgres..."
until docker exec llm-med-postgres-1 pg_isready -U postgres -q 2>/dev/null; do
  sleep 1
done
echo "Postgres is ready."

# Start Next.js dev server
npm run dev
