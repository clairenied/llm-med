#!/bin/bash
# Add or reset a test user
# Usage: ./scripts/add-test-user.sh [--local] [email] [firstName] [lastName]
#
# Options:
#   --local    Use local database instead of production
#
# Defaults to sholomcraig@gmail.com / Craig Niederberger if no args provided

# Get the directory where the script is located, then go to project root
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Check for --help flag
if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
  echo "Add or reset a test user"
  echo ""
  echo "Usage: ./scripts/add-test-user.sh [--local] [email] [firstName] [lastName]"
  echo ""
  echo "Options:"
  echo "  --local    Use local database instead of production"
  echo "  --help     Show this help message"
  echo ""
  echo "Defaults to sholomcraig@gmail.com / Craig Niederberger if no args provided"
  exit 0
fi

# Check for --local flag
if [ "$1" = "--local" ]; then
  USE_LOCAL=true
  shift
else
  USE_LOCAL=false
fi

EMAIL="${1:-sholomcraig@gmail.com}"
FIRST_NAME="${2:-Craig}"
LAST_NAME="${3:-Niederberger}"

# Get database URL
if [ "$USE_LOCAL" = true ]; then
  DB_URL="postgresql://postgres:postgres@localhost:5433/postgres"
  echo "Using LOCAL database"
else
  DB_URL=$(grep "^POSTGRES_URL_NON_POOLING=" "$PROJECT_ROOT/.env.production" | cut -d'"' -f2)
  if [ -z "$DB_URL" ]; then
    echo "Error: Could not find POSTGRES_URL_NON_POOLING in $PROJECT_ROOT/.env.production"
    echo "Run: vercel env pull .env.production --environment=production --token=\"\$VERCEL_TOKEN\""
    exit 1
  fi
  echo "Using PRODUCTION database"
fi

node -e "
const { Client } = require('pg');
const client = new Client({ connectionString: '$DB_URL' });

const email = '$EMAIL';
const firstName = '$FIRST_NAME';
const lastName = '$LAST_NAME';
const fullName = firstName + ' ' + lastName;

client.connect()
  .then(() => client.query(
    'SELECT id, email, \"invitationStatus\", \"emailVerified\" FROM \"User\" WHERE email = \$1',
    [email]
  ))
  .then(res => {
    if (res.rows.length > 0) {
      console.log('User exists, resetting to NOT_INVITED...');
      return client.query(
        'UPDATE \"User\" SET \"invitationStatus\" = \$1, \"emailVerified\" = NULL WHERE email = \$2 RETURNING email, \"invitationStatus\"',
        ['NOT_INVITED', email]
      ).then(r => console.log('✓ Reset:', r.rows[0].email, '->', r.rows[0].invitationStatus));
    } else {
      const id = require('crypto').randomUUID();
      return client.query(
        'INSERT INTO \"User\" (id, email, \"firstName\", \"lastName\", name, role, \"invitationStatus\", \"createdAt\", \"updatedAt\") VALUES (\$1, \$2, \$3, \$4, \$5, \$6, \$7, NOW(), NOW()) RETURNING email, \"invitationStatus\"',
        [id, email, firstName, lastName, fullName, 'GRADER', 'NOT_INVITED']
      ).then(r => console.log('✓ Created:', r.rows[0].email, '->', r.rows[0].invitationStatus));
    }
  })
  .then(() => client.end())
  .catch(err => { console.error('Error:', err.message); client.end(); process.exit(1); });
"
