#!/bin/bash
set -e

echo "========================================"
echo "  PCFS Demo: Post-Create Setup"
echo "========================================"

cd /workspace

# Update npm to latest version
echo ""
echo "[1/2] Updating npm to latest version..."
npm install -g npm@latest

# Install all dependencies (workspaces: root, shared, frontend, backend)
echo ""
echo "[2/2] Installing dependencies..."
npm install

echo ""
echo "========================================"
echo "  Post-Create Setup Complete!"
echo "========================================"
