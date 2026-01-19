#!/bin/bash
# Import database from a dump file
# Usage: ./scripts/db-import.sh [dump-file]
#        ./scripts/db-import.sh                    # imports latest dump
#        ./scripts/db-import.sh database-dumps/2026-01-19-reviews-289.sql.gz

set -e

cd "$(dirname "$0")/.."

# Find dump file
if [ -n "$1" ]; then
    DUMP_FILE="$1"
else
    # Find the most recent dump
    DUMP_FILE=$(ls -t database-dumps/*.sql.gz 2>/dev/null | head -1)
fi

if [ ! -f "$DUMP_FILE" ]; then
    echo "Error: No dump file found"
    echo "Usage: ./scripts/db-import.sh [dump-file]"
    exit 1
fi

echo "Importing from: ${DUMP_FILE}"
echo ""
echo "WARNING: This will DROP all existing data and replace it!"
read -p "Continue? (y/N) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled."
    exit 0
fi

echo "Dropping existing schema..."
docker exec -i llm-med-postgres-1 psql -U postgres -d postgres -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

echo "Importing data..."
gunzip -c "$DUMP_FILE" | docker exec -i llm-med-postgres-1 psql -U postgres postgres

echo ""
echo "Verifying import..."
docker exec -i llm-med-postgres-1 psql -U postgres -d postgres <<'EOF'
SELECT 'Manuscripts' as table_name, COUNT(*) as count FROM "Manuscript"
UNION ALL SELECT 'Reviews', COUNT(*) FROM "Review"
UNION ALL SELECT 'Reviewers', COUNT(*) FROM "Reviewer"
UNION ALL SELECT 'Users', COUNT(*) FROM "User";
EOF

echo ""
echo "Done!"
