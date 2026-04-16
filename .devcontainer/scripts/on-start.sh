#!/bin/bash
set -e

echo ""
echo "========================================"
echo "  PCFS Demo: Container Starting"
echo "========================================"

cd /workspace

# Step 1: Wait for infrastructure services to be ready
echo ""
echo "[Step 1/4] Waiting for infrastructure services..."
.devcontainer/scripts/wait-for-services.sh

# Step 2: Build shared types (needed by backend)
echo ""
echo "[Step 2/4] Building shared types..."
npm run build:shared

# Step 3: Build backend (needed for dist/main.js)
echo ""
echo "[Step 3/4] Building backend..."
npm run build:backend

# Step 4: Seed admin user (uses backend bcrypt)
echo ""
echo "[Step 4/4] Checking/seeding admin user..."
npx ts-node \
  --project backend/tsconfig.json \
  --require tsconfig-paths/register \
  .devcontainer/scripts/seed-admin.ts

echo ""
echo "========================================"
echo "  Container Ready!"
echo "========================================"
echo ""
echo "  Run 'npm run dev' to start development servers"
echo "  - Frontend: http://localhost:5173"
echo "  - Backend:  http://localhost:3000/api"
echo ""
