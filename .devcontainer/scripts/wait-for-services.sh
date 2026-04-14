#!/bin/bash
set -e

# Configuration
MAX_RETRIES=30
RETRY_INTERVAL=2

# Load environment variables
if [ -f /workspace/.env ]; then
  export $(grep -v '^#' /workspace/.env | xargs)
fi

# Default values
POSTGRES_HOST=${POSTGRES_HOST:-postgres}
POSTGRES_PORT=${POSTGRES_PORT:-5432}
POSTGRES_USER=${POSTGRES_USER:-user}
POSTGRES_DB=${POSTGRES_DB:-app_db}
MONGO_HOST=${MONGO_HOST:-mongodb}
MONGO_PORT=${MONGO_PORT:-27017}
SEAWEEDFS_HOST=${SEAWEEDFS_HOST:-seaweedfs}
SEAWEEDFS_MASTER_PORT=${SEAWEEDFS_MASTER_PORT:-9333}

echo "========================================"
echo "  Waiting for Infrastructure Services"
echo "========================================"

# Function to check PostgreSQL
check_postgres() {
  pg_isready -h "$POSTGRES_HOST" -p "$POSTGRES_PORT" -U "$POSTGRES_USER" -d "$POSTGRES_DB" > /dev/null 2>&1
}

# Function to check MongoDB (TCP check)
check_mongodb() {
  (echo > /dev/tcp/"$MONGO_HOST"/"$MONGO_PORT") > /dev/null 2>&1
}

# Function to check SeaweedFS (HTTP check)
check_seaweedfs() {
  curl -s -o /dev/null -w "%{http_code}" "http://${SEAWEEDFS_HOST}:${SEAWEEDFS_MASTER_PORT}/cluster/status" 2>/dev/null | grep -q "200"
}

# Wait for PostgreSQL
echo ""
echo "[1/3] Checking PostgreSQL ($POSTGRES_HOST:$POSTGRES_PORT)..."
retries=0
until check_postgres; do
  retries=$((retries + 1))
  if [ $retries -ge $MAX_RETRIES ]; then
    echo "ERROR: PostgreSQL not available after $MAX_RETRIES attempts"
    exit 1
  fi
  echo "  Waiting for PostgreSQL... (attempt $retries/$MAX_RETRIES)"
  sleep $RETRY_INTERVAL
done
echo "  PostgreSQL is ready!"

# Wait for MongoDB
echo ""
echo "[2/3] Checking MongoDB ($MONGO_HOST:$MONGO_PORT)..."
retries=0
until check_mongodb; do
  retries=$((retries + 1))
  if [ $retries -ge $MAX_RETRIES ]; then
    echo "ERROR: MongoDB not available after $MAX_RETRIES attempts"
    exit 1
  fi
  echo "  Waiting for MongoDB... (attempt $retries/$MAX_RETRIES)"
  sleep $RETRY_INTERVAL
done
echo "  MongoDB is ready!"

# Wait for SeaweedFS
echo ""
echo "[3/3] Checking SeaweedFS ($SEAWEEDFS_HOST:$SEAWEEDFS_MASTER_PORT)..."
retries=0
until check_seaweedfs; do
  retries=$((retries + 1))
  if [ $retries -ge $MAX_RETRIES ]; then
    echo "WARNING: SeaweedFS not available after $MAX_RETRIES attempts (non-critical)"
    break
  fi
  echo "  Waiting for SeaweedFS... (attempt $retries/$MAX_RETRIES)"
  sleep $RETRY_INTERVAL
done
if [ $retries -lt $MAX_RETRIES ]; then
  echo "  SeaweedFS is ready!"
fi

echo ""
echo "========================================"
echo "  All Services Ready!"
echo "========================================"
