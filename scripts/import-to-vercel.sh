#!/bin/bash
set -e

# Import database dump to Vercel Postgres
# Usage: ./scripts/import-to-vercel.sh

DUMP_FILE="database-dumps/2026-01-30-full-db.sql.gz"
TEMP_FILE="/tmp/llm-med-import.sql"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Vercel Postgres Import Script ===${NC}"
echo ""

# Check if dump file exists
if [ ! -f "$DUMP_FILE" ]; then
    echo -e "${RED}Error: Dump file not found at $DUMP_FILE${NC}"
    exit 1
fi

# Get connection string
if [ -z "$DATABASE_URL" ]; then
    echo -e "${YELLOW}No DATABASE_URL environment variable found.${NC}"
    echo ""
    echo "Please provide your Vercel Postgres connection string."
    echo "You can find this in: Vercel Dashboard → Storage → Your DB → Settings → Connection String"
    echo "(Use the 'Non-Pooling' connection string for migrations)"
    echo ""
    read -p "Paste connection string: " DATABASE_URL
    echo ""
fi

if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}Error: No connection string provided${NC}"
    exit 1
fi

# Confirm before proceeding
echo -e "${YELLOW}WARNING: This will REPLACE all data in the target database!${NC}"
echo ""
read -p "Are you sure you want to continue? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo "Aborted."
    exit 0
fi

echo ""
echo -e "${GREEN}Step 1/4: Decompressing dump file...${NC}"
gunzip -c "$DUMP_FILE" > "$TEMP_FILE"
echo "  Done. Temp file: $TEMP_FILE"

echo ""
echo -e "${GREEN}Step 2/4: Removing Vercel security token...${NC}"
# Remove the \restrict line (appears early in the file)
sed -i '' '/^\\restrict/d' "$TEMP_FILE"
echo "  Done."

echo ""
echo -e "${GREEN}Step 3/4: Importing to Vercel Postgres...${NC}"
echo "  This may take a minute..."
psql "$DATABASE_URL" < "$TEMP_FILE"
echo "  Done."

echo ""
echo -e "${GREEN}Step 4/4: Fixing migration history...${NC}"
# Add the missing migration record
psql "$DATABASE_URL" <<'EOF'
INSERT INTO _prisma_migrations (id, checksum, finished_at, migration_name, started_at, applied_steps_count)
SELECT 
    gen_random_uuid()::text,
    'manual_import_sync',
    NOW(),
    '20260131195000_add_missing_schema_changes',
    NOW(),
    1
WHERE NOT EXISTS (
    SELECT 1 FROM _prisma_migrations 
    WHERE migration_name = '20260131195000_add_missing_schema_changes'
);
EOF
echo "  Done."

# Cleanup
echo ""
echo -e "${GREEN}Cleaning up temp file...${NC}"
rm -f "$TEMP_FILE"

echo ""
echo -e "${GREEN}=== Import Complete! ===${NC}"
echo ""
echo "You can verify by running:"
echo "  npx prisma studio"
echo ""
echo "Or check migration status:"
echo "  npx prisma migrate status"
