#!/bin/sh
set -e

# Always install dependencies (npm install is idempotent)
echo "Installing npm dependencies..."
npm install

# Wait for database and then start app
echo "Waiting for database..."
dockerrize --wait tcp://db:3306 --timeout 60s

echo "Starting Node.js application..."
exec node server.js
