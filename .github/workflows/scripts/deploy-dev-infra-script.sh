#!/bin/bash
set -e
cd ~/inhu-backend
npm ci

if [ "$DB_DOWN_FLAG" = "true" ]; then
    npm run dev-infra:down
    npm run dev-infra:up
    until docker exec inhu-dev-postgres psql -U inhu_admin -d inhu -c "SELECT 1;" >/dev/null 2>&1; do
        sleep 1
    done
    npm run seed

    if [ "$USER_CHANGED" != "true" ] && [ "$ADMIN_CHANGED" != "true" ] && [ "$BATCH_CHANGED" != "true" ]; then
        pm2 reload inhu-backend-user-dev
        pm2 reload inhu-backend-admin-dev
        pm2 reload inhu-backend-batch-dev
    fi
fi