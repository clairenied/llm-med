#!/bin/bash
# Export database to a dated dump file
# Usage: ./scripts/db-export.sh [optional-suffix]

set -e

cd "$(dirname "$0")/.."

DATE=$(date +%Y-%m-%d)
SUFFIX=${1:-""}

# Get review count for filename
REVIEW_COUNT=$(docker exec llm-med-postgres-1 psql -U postgres -d postgres -t -c "SELECT COUNT(*) FROM \"Review\"" | tr -d ' ')

if [ -n "$SUFFIX" ]; then
    FILENAME="database-dumps/${DATE}-${SUFFIX}.sql.gz"
else
    FILENAME="database-dumps/${DATE}-reviews-${REVIEW_COUNT}.sql.gz"
fi

echo "Exporting database to ${FILENAME}..."
docker exec llm-med-postgres-1 pg_dump -U postgres postgres | gzip > "$FILENAME"

SIZE=$(ls -lh "$FILENAME" | awk '{print $5}')
echo "Done! Created ${FILENAME} (${SIZE})"
