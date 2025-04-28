#!/bin/bash

echo "Waiting for restaurant database..."
max_retries=30
counter=0

until (echo > /dev/tcp/restaurant-db/5432) >/dev/null 2>&1
do
  sleep 2
  counter=$((counter + 1))
  if [ $counter -eq $max_retries ]; then
    echo "Failed to connect to database after $max_retries retries"
    exit 1
  fi
  echo "Retrying database connection... ($counter/$max_retries)"
done

echo "Syncing database schema with Prisma schema..."
npx prisma db push --schema=apps/restaurant/prisma/schema.prisma

echo "Database schema synced successfully, starting restaurant service..."
npm run start:restaurant:prod
