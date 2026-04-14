#!/bin/bash

# =============================================================================
# PCFS Demo - Clean Script
# =============================================================================
# Removes all generated files and returns project to pristine codebase state.
#
# Usage:
#   ./clean.sh           # Interactive mode (prompts for confirmation)
#   ./clean.sh --force   # Skip confirmation
#   ./clean.sh --dry-run # Show what would be deleted without deleting
#
# What gets removed:
#   - node_modules (root + all workspaces)
#   - Build outputs (dist folders)
#   - Test coverage reports
#   - TypeScript build info files
#   - Docker data volumes (postgres, mongodb, seaweedfs)
#   - Runtime logs
#   - Package lock files (optional)
#   - .git folders in subdirectories (not root)
# =============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Parse arguments
FORCE=false
DRY_RUN=false
INCLUDE_LOCKS=false

for arg in "$@"; do
  case $arg in
    --force|-f)
      FORCE=true
      shift
      ;;
    --dry-run|-n)
      DRY_RUN=true
      shift
      ;;
    --include-locks)
      INCLUDE_LOCKS=true
      shift
      ;;
    --help|-h)
      echo "Usage: ./clean.sh [options]"
      echo ""
      echo "Options:"
      echo "  --force, -f        Skip confirmation prompt"
      echo "  --dry-run, -n      Show what would be deleted without deleting"
      echo "  --include-locks    Also remove package-lock.json files"
      echo "  --help, -h         Show this help message"
      exit 0
      ;;
  esac
done

echo -e "${BLUE}=============================================${NC}"
echo -e "${BLUE}  PCFS Demo - Clean Script${NC}"
echo -e "${BLUE}=============================================${NC}"
echo ""

# Function to remove item
remove_item() {
  local path="$1"
  local desc="$2"

  if [ -e "$path" ] || [ -d "$path" ]; then
    if [ "$DRY_RUN" = true ]; then
      echo -e "${YELLOW}[DRY-RUN]${NC} Would remove: $path"
    else
      echo -e "${GREEN}Removing:${NC} $desc"
      rm -rf "$path"
    fi
  fi
}

# Detect environment
is_wsl() {
  grep -qiE "(microsoft|wsl)" /proc/version 2>/dev/null
}

is_macos() {
  [[ "$OSTYPE" == "darwin"* ]]
}

# Convert WSL path to Windows path (for docker.exe)
# /mnt/c/Users/... -> C:/Users/...
wsl_to_windows_path() {
  local wsl_path="$1"
  if [[ "$wsl_path" =~ ^/mnt/([a-z])/(.*) ]]; then
    echo "${BASH_REMATCH[1]^^}:/${BASH_REMATCH[2]}"
  else
    echo "$wsl_path"
  fi
}

# Get the appropriate container runtime command for the current environment
# Supports: docker, podman (and their .exe variants on WSL)
get_docker_cmd() {
  if command -v docker &> /dev/null; then
    echo "docker"
  elif command -v podman &> /dev/null; then
    echo "podman"
  elif is_wsl; then
    # Try Windows executables from WSL
    if command -v docker.exe &> /dev/null; then
      echo "docker.exe"
    elif command -v podman.exe &> /dev/null; then
      echo "podman.exe"
    else
      echo ""
    fi
  else
    echo ""
  fi
}

# Function to remove Docker data directories using Docker (handles permission issues)
# Docker services create files as root/service users, making them undeletable by host user
remove_docker_data() {
  local data_dir="$1"

  if [ ! -d "$data_dir" ]; then
    return
  fi

  if [ "$DRY_RUN" = true ]; then
    echo -e "${YELLOW}[DRY-RUN]${NC} Would remove Docker data: $data_dir"
    return
  fi

  # First, try regular rm
  if rm -rf "$data_dir" 2>/dev/null; then
    echo -e "${GREEN}Removed:${NC} $data_dir"
    return
  fi

  # If that fails (permission denied), use Docker to remove
  local docker_cmd=$(get_docker_cmd)

  if [ -n "$docker_cmd" ]; then
    echo -e "${YELLOW}Permission issue detected, using Docker to remove:${NC} $data_dir"

    local mount_path="$(pwd)"
    local container_path="/workspace/$data_dir"

    # If using .exe variant from WSL, convert paths to Windows format
    if [[ "$docker_cmd" == *.exe ]]; then
      mount_path=$(wsl_to_windows_path "$mount_path")
    fi

    "$docker_cmd" run --rm -v "$mount_path:/workspace" alpine rm -rf "$container_path" 2>/dev/null
    if [ $? -eq 0 ]; then
      echo -e "${GREEN}Removed via Docker:${NC} $data_dir"
    else
      echo -e "${RED}Failed to remove:${NC} $data_dir (try: sudo rm -rf $data_dir)"
    fi
  else
    if is_wsl; then
      echo -e "${RED}Cannot remove:${NC} $data_dir"
      echo -e "  ${YELLOW}Tip:${NC} Enable Docker/Podman WSL integration, or run from PowerShell:"
      echo -e "  ${BLUE}Remove-Item -Recurse -Force .\\data${NC}"
    else
      echo -e "${RED}Cannot remove:${NC} $data_dir (Docker/Podman not available, try: sudo rm -rf $data_dir)"
    fi
  fi
}

# Function to remove by pattern
remove_pattern() {
  local pattern="$1"
  local desc="$2"

  local found=$(find . -name "$pattern" -not -path "./.git/*" 2>/dev/null | head -5)
  if [ -n "$found" ]; then
    if [ "$DRY_RUN" = true ]; then
      echo -e "${YELLOW}[DRY-RUN]${NC} Would remove files matching: $pattern"
      find . -name "$pattern" -not -path "./.git/*" 2>/dev/null | while read f; do
        echo "  - $f"
      done
    else
      echo -e "${GREEN}Removing:${NC} $desc"
      find . -name "$pattern" -not -path "./.git/*" -exec rm -rf {} + 2>/dev/null || true
    fi
  fi
}

# Show what will be cleaned
echo -e "${YELLOW}The following will be removed:${NC}"
echo "  - node_modules/ (root + frontend + backend)"
echo "  - dist/ folders (frontend + backend)"
echo "  - coverage/ folders"
echo "  - *.tsbuildinfo files"
echo "  - data/ contents (postgres, mongodb, seaweedfs volumes)"
echo "  - logs.txt"
echo "  - .git folders in subdirectories"
if [ "$INCLUDE_LOCKS" = true ]; then
  echo "  - package-lock.json files"
fi
echo ""

# Confirmation prompt
if [ "$FORCE" = false ] && [ "$DRY_RUN" = false ]; then
  read -p "Are you sure you want to proceed? (y/N) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}Aborted.${NC}"
    exit 1
  fi
  echo ""
fi

# =============================================================================
# Clean node_modules
# =============================================================================
echo -e "${BLUE}--- Cleaning node_modules ---${NC}"
remove_item "node_modules" "root node_modules"
remove_item "frontend/node_modules" "frontend node_modules"
remove_item "backend/node_modules" "backend node_modules"

# =============================================================================
# Clean build outputs
# =============================================================================
echo -e "${BLUE}--- Cleaning build outputs ---${NC}"
remove_item "frontend/dist" "frontend dist"
remove_item "backend/dist" "backend dist"

# =============================================================================
# Clean coverage reports
# =============================================================================
echo -e "${BLUE}--- Cleaning coverage reports ---${NC}"
remove_item "coverage" "root coverage"
remove_item "frontend/coverage" "frontend coverage"
remove_item "backend/coverage" "backend coverage"

# =============================================================================
# Clean TypeScript build info
# =============================================================================
echo -e "${BLUE}--- Cleaning TypeScript build info ---${NC}"
remove_pattern "*.tsbuildinfo" "TypeScript build info files"

# =============================================================================
# Clean Docker data volumes
# =============================================================================
echo -e "${BLUE}--- Cleaning Docker data volumes ---${NC}"
if [ -d "data" ]; then
  # Use Docker-aware removal for data directories (handles root-owned files)
  remove_docker_data "data/postgres"
  remove_docker_data "data/mongodb"
  remove_docker_data "data/mongo"
  remove_docker_data "data/seaweedfs"
fi
# Recreate empty data directories (required for Docker/Podman volume mounts)
# Pre-creating with current user ownership helps avoid permission issues
if [ "$DRY_RUN" = false ]; then
  echo -e "${GREEN}Recreating:${NC} empty data directories for volume mounts"
  mkdir -p data/postgres data/mongo data/seaweedfs
  # Create .gitkeep files to track empty directories in git
  touch data/.gitkeep data/postgres/.gitkeep data/mongo/.gitkeep data/seaweedfs/.gitkeep
fi

# =============================================================================
# Clean runtime logs
# =============================================================================
echo -e "${BLUE}--- Cleaning runtime logs ---${NC}"
remove_item "logs.txt" "runtime logs"
remove_pattern "*.log" "log files"

# =============================================================================
# Clean .git folders in subdirectories (not root)
# =============================================================================
echo -e "${BLUE}--- Cleaning nested .git folders ---${NC}"
# Find .git folders that are not the root .git
nested_git=$(find . -mindepth 2 -name ".git" -type d 2>/dev/null)
if [ -n "$nested_git" ]; then
  if [ "$DRY_RUN" = true ]; then
    echo -e "${YELLOW}[DRY-RUN]${NC} Would remove nested .git folders:"
    echo "$nested_git" | while read f; do
      echo "  - $f"
    done
  else
    echo -e "${GREEN}Removing:${NC} nested .git folders"
    find . -mindepth 2 -name ".git" -type d -exec rm -rf {} + 2>/dev/null || true
  fi
else
  echo "  No nested .git folders found"
fi

# =============================================================================
# Clean package-lock.json files (optional)
# =============================================================================
if [ "$INCLUDE_LOCKS" = true ]; then
  echo -e "${BLUE}--- Cleaning package-lock.json files ---${NC}"
  remove_item "package-lock.json" "root package-lock.json"
  remove_item "frontend/package-lock.json" "frontend package-lock.json"
  remove_item "backend/package-lock.json" "backend package-lock.json"
fi

# =============================================================================
# Clean misc temp files
# =============================================================================
echo -e "${BLUE}--- Cleaning misc temp files ---${NC}"
remove_pattern ".DS_Store" "macOS .DS_Store files"
remove_pattern "Thumbs.db" "Windows Thumbs.db files"
remove_pattern "*.swp" "Vim swap files"
remove_pattern "*~" "backup files"

# =============================================================================
# Done
# =============================================================================
echo ""
if [ "$DRY_RUN" = true ]; then
  echo -e "${YELLOW}=============================================${NC}"
  echo -e "${YELLOW}  DRY RUN COMPLETE - No files were deleted${NC}"
  echo -e "${YELLOW}=============================================${NC}"
else
  echo -e "${GREEN}=============================================${NC}"
  echo -e "${GREEN}  Clean complete!${NC}"
  echo -e "${GREEN}=============================================${NC}"
  echo ""
  echo "To reinstall dependencies, run:"
  echo "  npm install"
fi
