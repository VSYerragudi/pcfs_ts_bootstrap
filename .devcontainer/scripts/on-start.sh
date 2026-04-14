#!/bin/bash
set -e

echo ""
echo "========================================"
echo "  PCFS Demo: Container Starting"
echo "========================================"

cd /workspace

# Step 1: Wait for infrastructure services to be ready
echo ""
echo "[Step 1/3] Waiting for infrastructure services..."
.devcontainer/scripts/wait-for-services.sh

# Step 2: Build backend (needed for dist/main.js)
echo ""
echo "[Step 2/3] Building backend..."
npm run build:backend

# Step 3: Seed admin user (uses backend bcrypt)
echo ""
echo "[Step 3/3] Checking/seeding admin user..."
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
