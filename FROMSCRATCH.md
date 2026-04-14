# FROMSCRATCH.md

A comprehensive step-by-step guide to recreate this full-stack monorepo project from an empty folder.

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Project Setup](#2-project-setup)
3. [Root Configuration](#3-root-configuration)
4. [Shared Package](#4-shared-package)
5. [Backend Setup](#5-backend-setup)
6. [Frontend Setup](#6-frontend-setup)
7. [Infrastructure Setup](#7-infrastructure-setup)
8. [Devcontainer Setup](#8-devcontainer-setup)
9. [Final Configuration](#9-final-configuration)
10. [Verification](#10-verification)

---

## 1. Prerequisites

Ensure you have the following installed:

- **Node.js 24 LTS** or higher
- **npm** (comes with Node.js)
- **Git**
- **Docker** (for infrastructure services)
- **VS Code** (recommended)

Verify installations:

```bash
node --version    # Should be >= 24.0.0
npm --version     # Should be >= 10.0.0
git --version
docker --version
```

---

## 2. Project Setup

### 2.1 Create Project Directory

```bash
mkdir pcfs-demo
cd pcfs-demo
```

### 2.2 Initialize Git Repository

```bash
git init
```

### 2.3 Create Directory Structure

```bash
mkdir -p frontend/src/{assets,components,hooks,layouts,lib,pages,routes,services,stores,test}
mkdir -p frontend/src/components/{admin,ui}
mkdir -p frontend/src/pages/admin
mkdir -p frontend/public
mkdir -p backend/src/{admin,auth,audit-log,common,database,users,storage}
mkdir -p backend/src/auth/{decorators,dto,guards,strategies}
mkdir -p backend/src/audit-log/schemas
mkdir -p backend/src/common/enums
mkdir -p backend/src/users/{dto,entities}
mkdir -p backend/src/storage/{config,dto,schemas}
mkdir -p backend/test
mkdir -p shared/types
mkdir -p infrastructure
mkdir -p .devcontainer/scripts
mkdir -p .husky

# Create data directories for Docker volumes (with .gitkeep to track in git)
mkdir -p data/{postgres,mongo,seaweedfs}
touch data/.gitkeep data/postgres/.gitkeep data/mongo/.gitkeep data/seaweedfs/.gitkeep
```

---

## 3. Root Configuration

### 3.1 Create Root package.json

```bash
npm init -y
```

Edit `package.json`:

```json
{
  "name": "pcfs-demo",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "workspaces": [
    "shared",
    "frontend",
    "backend"
  ],
  "scripts": {
    "prepare": "husky",
    "dev": "npm run dev:all",
    "dev:all": "npm run dev:frontend & npm run dev:backend",
    "dev:frontend": "npm run dev --workspace=frontend",
    "dev:backend": "npm run start:dev --workspace=backend",
    "build": "npm run build:all",
    "build:all": "npm run build:frontend && npm run build:backend",
    "build:frontend": "npm run build --workspace=frontend",
    "build:backend": "npm run build --workspace=backend",
    "typecheck": "npm run typecheck:all",
    "typecheck:all": "npm run typecheck:frontend && npm run typecheck:backend",
    "typecheck:frontend": "npm run typecheck --workspace=frontend",
    "typecheck:backend": "npm run typecheck --workspace=backend",
    "test": "npm run test:all",
    "test:all": "npm run test:frontend && npm run test:backend",
    "test:frontend": "npm run test --workspace=frontend",
    "test:backend": "npm run test --workspace=backend",
    "test:e2e": "npm run test:e2e --workspace=backend",
    "test:coverage": "npm run test:coverage --workspace=frontend && npm run test:cov --workspace=backend",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "start:prod": "npm run start:prod --workspace=backend",
    "install:all": "npm install",
    "clean": "rm -rf node_modules frontend/node_modules backend/node_modules frontend/dist backend/dist coverage frontend/coverage backend/coverage *.tsbuildinfo frontend/*.tsbuildinfo backend/*.tsbuildinfo",
    "clean:dist": "rm -rf frontend/dist backend/dist",
    "reinstall": "npm run clean && npm install",
    "verify": "npm run typecheck && npm run lint && npm run test && npm run build",
    "pre-commit": "lint-staged"
  },
  "devDependencies": {
    "@eslint/js": "^9.39.4",
    "eslint": "^9.39.4",
    "eslint-config-prettier": "^10.0.1",
    "eslint-plugin-react-hooks": "^7.0.1",
    "eslint-plugin-react-refresh": "^0.5.2",
    "globals": "^17.4.0",
    "husky": "^9.1.7",
    "lint-staged": "^16.4.0",
    "prettier": "^3.4.2",
    "typescript": "~6.0.2",
    "typescript-eslint": "^8.58.0"
  },
  "engines": {
    "node": ">=24.0.0"
  }
}
```

### 3.2 Create .gitignore

Create a comprehensive cross-platform `.gitignore` that covers Windows, macOS, Linux/WSL, and common IDEs:

```bash
cat > .gitignore << 'EOF'
# =============================================================================
# Dependencies
# =============================================================================
node_modules/
.pnp/
.pnp.js
.yarn/

# =============================================================================
# Build outputs
# =============================================================================
dist/
build/
out/
*.tsbuildinfo

# =============================================================================
# Environment files (keep .env.example)
# =============================================================================
.env
.env.local
.env.development
.env.production
.env.test
.env*.local
!.env.example

# =============================================================================
# IDE - Visual Studio Code
# =============================================================================
.vscode/*
!.vscode/extensions.json
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
*.code-workspace

# =============================================================================
# IDE - JetBrains (WebStorm, IntelliJ, etc.)
# =============================================================================
.idea/
*.iml
*.ipr
*.iws

# =============================================================================
# IDE - Vim / Neovim
# =============================================================================
*.swp
*.swo
*.swn
*~
.netrwhist
tags

# =============================================================================
# IDE - Sublime Text
# =============================================================================
*.sublime-workspace
*.sublime-project

# =============================================================================
# IDE - Other
# =============================================================================
*.komodoproject
.komodotools/
*.kate-swp
.settings/
*.launch
.project
.classpath

# =============================================================================
# OS - macOS
# =============================================================================
.DS_Store
.AppleDouble
.LSOverride
._*
.DocumentRevisions-V100
.fseventsd
.Spotlight-V100
.TemporaryItems
.Trashes
.VolumeIcon.icns
.com.apple.timemachine.donotpresent
.AppleDB
.AppleDesktop
Network Trash Folder
Temporary Items
.apdisk
Icon?

# =============================================================================
# OS - Windows
# =============================================================================
Thumbs.db
Thumbs.db:encryptable
ehthumbs.db
ehthumbs_vista.db
*.stackdump
[Dd]esktop.ini
$RECYCLE.BIN/
*.cab
*.msi
*.msix
*.msm
*.msp
*.lnk

# =============================================================================
# OS - Linux / WSL
# =============================================================================
*~
.fuse_hidden*
.directory
.Trash-*
.nfs*

# =============================================================================
# Logs
# =============================================================================
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*
logs.txt

# =============================================================================
# Testing & Coverage
# =============================================================================
coverage/
*.lcov
.nyc_output/
lib-cov/
junit.xml
test-results/

# =============================================================================
# Docker data volumes
# =============================================================================
data/postgres/*
data/mongo/*
data/mongodb/*
data/seaweedfs/*
!data/.gitkeep
!data/postgres/.gitkeep
!data/mongo/.gitkeep
!data/seaweedfs/.gitkeep

# =============================================================================
# Temporary & Cache files
# =============================================================================
tmp/
temp/
.tmp/
.temp/
*.tmp
*.temp
*.bak
*.backup
.cache/
.parcel-cache/
.eslintcache
.stylelintcache
*.tgz

# =============================================================================
# TypeScript
# =============================================================================
*.js.map
*.d.ts.map
tsconfig.tsbuildinfo

# =============================================================================
# Node.js
# =============================================================================
.node_repl_history
*.pid
*.seed
*.pid.lock
.npm/
.yarn-integrity
.pnpm-store/

# =============================================================================
# NestJS
# =============================================================================
.nest/

# =============================================================================
# Vite
# =============================================================================
vite.config.ts.timestamp-*
vite.config.js.timestamp-*

# =============================================================================
# Vitest
# =============================================================================
vitest.config.ts.timestamp-*
html/

# =============================================================================
# Jest
# =============================================================================
jest.config.js.timestamp-*
.jest/

# =============================================================================
# Runtime & Debug
# =============================================================================
*.dylib
*.so
*.dll

# =============================================================================
# Misc
# =============================================================================
.env.sentry-build-plugin
.vercel
.netlify
.turbo
EOF
```

### 3.3 Create .prettierrc.json

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "tabWidth": 2,
  "printWidth": 100,
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

### 3.4 Create .prettierignore

```
dist
node_modules
coverage
*.tsbuildinfo
package-lock.json
data
```

### 3.5 Create .lintstagedrc.json

This configuration defines what checks run on staged files during pre-commit:

```json
{
  "frontend/**/*.{ts,tsx}": [
    "eslint --fix",
    "prettier --write"
  ],
  "backend/**/*.ts": [
    "eslint --fix",
    "prettier --write"
  ],
  "*.{js,mjs,json,md}": [
    "prettier --write"
  ]
}
```

**What runs on pre-commit:**

| Check | Staged Files | Action |
|-------|--------------|--------|
| ESLint | `*.ts`, `*.tsx` | Lint and auto-fix issues |
| Prettier | All supported | Format code automatically |

**What does NOT run on pre-commit (by design):**

| Check | Reason | When to Run |
|-------|--------|-------------|
| Tests | Too slow, breaks flow | `npm run test` or CI/CD |
| Type checking | Can be slow on large projects | `npm run typecheck` or CI/CD |
| Test coverage | Requires full test suite | `npm run test:coverage` or CI/CD |

**Pre-push alternative:** For teams wanting stricter checks before pushing, create `.husky/pre-push`:

```bash
npm run typecheck && npm run test
```

### 3.6 Create eslint.config.js

```javascript
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default tseslint.config(
  // Global ignores
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/coverage/**',
      '**/routeTree.gen.ts',
    ],
  },

  // Base config for all TypeScript files
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // Frontend React configuration
  {
    files: ['frontend/**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    languageOptions: {
      ecmaVersion: 2024,
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },

  // Backend NestJS configuration
  {
    files: ['backend/**/*.ts'],
    languageOptions: {
      ecmaVersion: 2024,
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },

  // Prettier must be last to override conflicting rules
  prettier,
);
```

### 3.7 Create .env.example

```bash
cat > .env.example << 'EOF'
# ===========================================
# PCFS Demo Project - Environment Configuration
# ===========================================
# Copy this file to .env and update values as needed
# DO NOT commit .env to version control
# ===========================================

# Application
NODE_ENV=development
PORT=3000
CORS_ORIGIN=http://localhost:5173

# Frontend
VITE_API_URL=http://localhost:3000/api

# JWT Authentication
# IMPORTANT: Change these secrets in production!
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# PostgreSQL
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=app_db

# MongoDB
MONGO_HOST=mongodb
MONGO_PORT=27017
MONGO_USER=admin
MONGO_PASSWORD=password
MONGO_DB=app_db

# SeaweedFS (S3-compatible storage)
SEAWEEDFS_HOST=seaweedfs
SEAWEEDFS_MASTER_PORT=9333
SEAWEEDFS_S3_PORT=8333
SEAWEEDFS_FILER_PORT=8888
EOF
```

### 3.8 Create .env (copy from example)

```bash
cp .env.example .env
```

### 3.9 Setup Husky (Git Hooks)

Husky manages Git hooks to enforce code quality before commits.

```bash
npx husky init
```

#### Create `.husky/pre-commit`

This hook runs on every commit:

```bash
cat > .husky/pre-commit << 'EOF'
npm run pre-commit
EOF
```

**Pre-commit workflow:**
```
git commit
    │
    ▼
.husky/pre-commit
    │
    ▼
npm run pre-commit (runs lint-staged)
    │
    ├─▶ ESLint --fix (staged .ts/.tsx files)
    ├─▶ Prettier --write (staged files)
    │
    ▼
Commit proceeds (or fails if unfixable errors)
```

#### Optional: Create `.husky/pre-push`

For stricter checks before pushing to remote:

```bash
cat > .husky/pre-push << 'EOF'
npm run typecheck && npm run test
EOF
```

**Note:** Pre-push hooks run full type checking and tests, which can take time but ensures code quality before sharing with the team.

### 3.10 Create LICENSE.txt

Create your license file (MIT, Apache, etc.).

### 3.11 Create clean.sh

Create a cross-platform cleanup script that handles Docker/Podman-created files:

```bash
cat > clean.sh << 'CLEANEOF'
#!/bin/bash

# =============================================================================
# PCFS Demo - Clean Script
# =============================================================================
# Removes all generated files and returns project to pristine codebase state.
# Supports: Linux, macOS, Windows (WSL) with Docker or Podman
#
# Usage:
#   ./clean.sh           # Interactive mode (prompts for confirmation)
#   ./clean.sh --force   # Skip confirmation
#   ./clean.sh --dry-run # Show what would be deleted without deleting
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

for arg in "$@"; do
  case $arg in
    --force|-f) FORCE=true; shift ;;
    --dry-run|-n) DRY_RUN=true; shift ;;
    --help|-h)
      echo "Usage: ./clean.sh [options]"
      echo "Options:"
      echo "  --force, -f     Skip confirmation prompt"
      echo "  --dry-run, -n   Show what would be deleted without deleting"
      exit 0
      ;;
  esac
done

# Detect environment
is_wsl() { grep -qiE "(microsoft|wsl)" /proc/version 2>/dev/null; }

# Convert WSL path to Windows path (for docker.exe/podman.exe)
wsl_to_windows_path() {
  local wsl_path="$1"
  if [[ "$wsl_path" =~ ^/mnt/([a-z])/(.*) ]]; then
    echo "${BASH_REMATCH[1]^^}:/${BASH_REMATCH[2]}"
  else
    echo "$wsl_path"
  fi
}

# Get the appropriate container runtime (docker or podman)
get_docker_cmd() {
  if command -v docker &> /dev/null; then echo "docker"
  elif command -v podman &> /dev/null; then echo "podman"
  elif is_wsl; then
    if command -v docker.exe &> /dev/null; then echo "docker.exe"
    elif command -v podman.exe &> /dev/null; then echo "podman.exe"
    fi
  fi
}

# Remove item helper
remove_item() {
  local path="$1" desc="$2"
  if [ -e "$path" ] || [ -d "$path" ]; then
    if [ "$DRY_RUN" = true ]; then
      echo -e "${YELLOW}[DRY-RUN]${NC} Would remove: $path"
    else
      echo -e "${GREEN}Removing:${NC} $desc"
      rm -rf "$path"
    fi
  fi
}

# Remove Docker data with container runtime fallback for permission issues
remove_docker_data() {
  local data_dir="$1"
  [ ! -d "$data_dir" ] && return
  [ "$DRY_RUN" = true ] && echo -e "${YELLOW}[DRY-RUN]${NC} Would remove: $data_dir" && return

  # Try regular rm first
  if rm -rf "$data_dir" 2>/dev/null; then
    echo -e "${GREEN}Removed:${NC} $data_dir"
    return
  fi

  # Fallback to container runtime for permission issues
  local docker_cmd=$(get_docker_cmd)
  if [ -n "$docker_cmd" ]; then
    echo -e "${YELLOW}Permission issue, using container to remove:${NC} $data_dir"
    local mount_path="$(pwd)"
    [[ "$docker_cmd" == *.exe ]] && mount_path=$(wsl_to_windows_path "$mount_path")
    "$docker_cmd" run --rm -v "$mount_path:/workspace" alpine rm -rf "/workspace/$data_dir" 2>/dev/null
    [ $? -eq 0 ] && echo -e "${GREEN}Removed via container:${NC} $data_dir"
  else
    echo -e "${RED}Cannot remove:${NC} $data_dir (try: sudo rm -rf $data_dir)"
  fi
}

echo -e "${BLUE}=== PCFS Demo - Clean Script ===${NC}"

# Confirmation
if [ "$FORCE" = false ] && [ "$DRY_RUN" = false ]; then
  read -p "Remove all generated files? (y/N) " -n 1 -r
  echo
  [[ ! $REPLY =~ ^[Yy]$ ]] && echo "Aborted." && exit 1
fi

# Clean node_modules
remove_item "node_modules" "root node_modules"
remove_item "frontend/node_modules" "frontend node_modules"
remove_item "backend/node_modules" "backend node_modules"

# Clean build outputs
remove_item "frontend/dist" "frontend dist"
remove_item "backend/dist" "backend dist"

# Clean coverage
remove_item "coverage" "root coverage"
remove_item "frontend/coverage" "frontend coverage"
remove_item "backend/coverage" "backend coverage"

# Clean Docker data volumes
remove_docker_data "data/postgres"
remove_docker_data "data/mongo"
remove_docker_data "data/seaweedfs"

# Recreate empty data directories with .gitkeep files
if [ "$DRY_RUN" = false ]; then
  echo -e "${GREEN}Recreating:${NC} empty data directories"
  mkdir -p data/postgres data/mongo data/seaweedfs
  touch data/.gitkeep data/postgres/.gitkeep data/mongo/.gitkeep data/seaweedfs/.gitkeep
fi

# Clean misc
remove_item "logs.txt" "runtime logs"

echo -e "${GREEN}=== Clean complete! ===${NC}"
echo "Run 'npm install' to reinstall dependencies."
CLEANEOF

chmod +x clean.sh
```

---

## 4. Shared Package

### 4.1 Create shared/package.json

```json
{
  "name": "@pcfs-demo/shared",
  "version": "0.0.1",
  "description": "Shared types and DTOs for PCFS Demo",
  "main": "types/index.ts",
  "types": "types/index.ts",
  "private": true,
  "license": "SEE LICENSE IN ../LICENSE.txt",
  "exports": {
    ".": "./types/index.ts",
    "./types": "./types/index.ts"
  }
}
```

### 4.2 Create shared/types/user.types.ts

```typescript
export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

export interface UserDto {
  id: string;
  email: string;
  name: string;
  roles: Role[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  name: string;
  roles?: Role[];
  isActive?: boolean;
}

export interface UpdateUserRequest {
  email?: string;
  password?: string;
  name?: string;
  roles?: Role[];
  isActive?: boolean;
}
```

### 4.3 Create shared/types/auth.types.ts

```typescript
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * User info returned in login response.
 * This is a subset of UserDto - only essential info for the client.
 */
export interface LoginUser {
  id: string;
  email: string;
  name: string;
  roles: string[];
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: LoginUser;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface LogoutRequest {
  refreshToken?: string;
}

export interface TokenPayload {
  sub: string; // user id
  email: string;
  roles: string[];
  type: 'access' | 'refresh';
  iat?: number;
  exp?: number;
}
```

### 4.4 Create shared/types/api.types.ts

```typescript
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
```

### 4.5 Create shared/types/index.ts

```typescript
export * from './user.types';
export * from './auth.types';
export * from './api.types';
```

---

## 5. Backend Setup

### 5.1 Initialize NestJS Project

```bash
cd backend
npm init -y
```

### 5.2 Create backend/package.json

```json
{
  "name": "backend",
  "version": "0.0.1",
  "description": "",
  "author": "",
  "private": true,
  "license": "SEE LICENSE IN LICENSE.txt",
  "scripts": {
    "build": "nest build",
    "typecheck": "tsc --noEmit",
    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
    "test:e2e": "jest --config ./test/jest-e2e.json"
  },
  "dependencies": {
    "@aws-sdk/client-s3": "^3.700.0",
    "@aws-sdk/s3-request-presigner": "^3.700.0",
    "@nestjs/common": "^11.1.18",
    "@nestjs/config": "^4.0.2",
    "@nestjs/core": "^11.1.18",
    "@nestjs/jwt": "^11.0.0",
    "@nestjs/mongoose": "^11.0.2",
    "@nestjs/passport": "^11.0.5",
    "@nestjs/platform-express": "^11.1.18",
    "@nestjs/typeorm": "^11.0.0",
    "@pcfs-demo/shared": "*",
    "bcrypt": "^6.0.0",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.1",
    "mime-types": "^2.1.35",
    "mongoose": "^8.9.5",
    "passport": "^0.7.0",
    "passport-jwt": "^4.0.1",
    "pg": "^8.16.0",
    "reflect-metadata": "^0.2.2",
    "rxjs": "^7.8.1",
    "typeorm": "^0.3.25",
    "uuid": "^11.1.0"
  },
  "devDependencies": {
    "@eslint/eslintrc": "^3.2.0",
    "@eslint/js": "^9.39.4",
    "@nestjs/cli": "^11.0.0",
    "@nestjs/schematics": "^11.0.0",
    "@nestjs/testing": "^11.1.18",
    "@types/bcrypt": "^5.0.2",
    "@types/express": "^5.0.0",
    "@types/jest": "^30.0.0",
    "@types/mime-types": "^2.1.4",
    "@types/multer": "^1.4.12",
    "@types/node": "^24.12.2",
    "@types/passport-jwt": "^4.0.1",
    "@types/supertest": "^7.0.0",
    "@types/uuid": "^10.0.0",
    "eslint": "^9.39.4",
    "eslint-config-prettier": "^10.0.1",
    "eslint-plugin-prettier": "^5.2.2",
    "globals": "^17.4.0",
    "jest": "^30.0.0",
    "prettier": "^3.4.2",
    "source-map-support": "^0.5.21",
    "supertest": "^7.0.0",
    "ts-jest": "^29.2.5",
    "ts-loader": "^9.5.2",
    "ts-node": "^10.9.2",
    "tsconfig-paths": "^4.2.0",
    "typescript": "~6.0.2",
    "typescript-eslint": "^8.58.0"
  },
  "jest": {
    "moduleFileExtensions": ["js", "json", "ts"],
    "rootDir": "src",
    "testRegex": ".*\\.spec\\.ts$",
    "transform": {
      "^.+\\.(t|j)s$": "ts-jest"
    },
    "collectCoverageFrom": ["**/*.(t|j)s"],
    "coverageDirectory": "../coverage",
    "testEnvironment": "node",
    "moduleNameMapper": {
      "^@/(.*)$": "<rootDir>/$1"
    }
  }
}
```

### 5.3 Create backend/tsconfig.json (TypeScript 6 Configuration)

```json
{
  "compilerOptions": {
    /* TypeScript 6 Defaults */
    "target": "ES2025",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,

    /* NestJS Requirements */
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,

    /* Module Settings */
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "resolveJsonModule": true,

    /* Output */
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "removeComments": true,

    /* Project Structure */
    "rootDir": "./src",
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"]
    },
    "incremental": true,

    /* Type Definitions */
    "lib": ["ES2025"],
    "types": ["node", "jest"],

    /* Code Quality */
    "noImplicitAny": true,
    "strictBindCallApply": true,
    "strictNullChecks": true,
    "strictPropertyInitialization": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true,
    "noUncheckedIndexedAccess": true,

    /* TypeScript 6/7 Preparation */
    "stableTypeOrdering": true,

    /* Performance */
    "skipLibCheck": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 5.4 Create backend/tsconfig.build.json

```json
{
  "extends": "./tsconfig.json",
  "exclude": ["node_modules", "dist", "test", "**/*.spec.ts", "**/*.e2e-spec.ts"]
}
```

### 5.5 Create backend/nest-cli.json

```json
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "deleteOutDir": true,
    "tsConfigPath": "tsconfig.json"
  }
}
```

### 5.6 Create Backend Source Files

#### backend/src/main.ts

```typescript
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend
  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
    credentials: true,
  });

  // Enable validation pipes globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Set global prefix for API routes
  app.setGlobalPrefix('api');

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`Application is running on: http://localhost:${port}/api`);
}
bootstrap();
```

#### backend/src/app.module.ts

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { MongoDBModule } from './database/mongodb.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AdminModule } from './admin/admin.module';
import { AuditLogModule } from './audit-log/audit-log.module';
import { StorageModule } from './storage/storage.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../.env',
    }),
    DatabaseModule,
    MongoDBModule,
    AuthModule,
    UsersModule,
    AdminModule,
    AuditLogModule,
    StorageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

#### backend/src/app.controller.ts

```typescript
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
```

#### backend/src/app.service.ts

```typescript
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
```

#### backend/src/database/database.module.ts

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('POSTGRES_HOST', 'localhost'),
        port: configService.get<number>('POSTGRES_PORT', 5432),
        username: configService.get<string>('POSTGRES_USER', 'user'),
        password: configService.get<string>('POSTGRES_PASSWORD', 'password'),
        database: configService.get<string>('POSTGRES_DB', 'app_db'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: configService.get<string>('NODE_ENV') === 'development',
        logging: configService.get<string>('NODE_ENV') === 'development',
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
```

#### backend/src/database/mongodb.module.ts

```typescript
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const host = configService.get<string>('MONGO_HOST', 'localhost');
        const port = configService.get<number>('MONGO_PORT', 27017);
        const user = configService.get<string>('MONGO_USER', 'admin');
        const password = configService.get<string>('MONGO_PASSWORD', 'password');
        const database = configService.get<string>('MONGO_DB', 'app_db');

        return {
          uri: `mongodb://${user}:${password}@${host}:${port}/${database}?authSource=admin`,
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class MongoDBModule {}
```

#### backend/src/users/entities/user.entity.ts

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from '@pcfs-demo/shared';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column()
  name!: string;

  @Column('simple-array', { default: 'user' })
  roles!: Role[];

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Flag to track if password needs hashing
  private tempPassword?: string;

  @BeforeInsert()
  async hashPasswordBeforeInsert() {
    if (this.password && !this.password.startsWith('$2b$')) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  @BeforeUpdate()
  async hashPasswordBeforeUpdate() {
    if (this.tempPassword) {
      this.password = await bcrypt.hash(this.tempPassword, 10);
      this.tempPassword = undefined;
    }
  }

  setPassword(password: string) {
    this.tempPassword = password;
    this.password = password; // Will be hashed in BeforeUpdate
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  toSafeObject(): Omit<User, 'password' | 'tempPassword' | 'hashPasswordBeforeInsert' | 'hashPasswordBeforeUpdate' | 'setPassword' | 'validatePassword' | 'toSafeObject'> {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      roles: this.roles,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
```

#### backend/src/users/dto/create-user.dto.ts

```typescript
import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsEnum,
  IsArray,
  IsBoolean,
} from 'class-validator';
import { Role } from '@pcfs-demo/shared';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @IsString()
  @MinLength(2)
  name: string;

  @IsOptional()
  @IsArray()
  @IsEnum(Role, { each: true })
  roles?: Role[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
```

#### backend/src/users/dto/update-user.dto.ts

```typescript
import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsEnum,
  IsArray,
  IsBoolean,
} from 'class-validator';
import { Role } from '@pcfs-demo/shared';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @IsOptional()
  @IsArray()
  @IsEnum(Role, { each: true })
  roles?: Role[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
```

#### backend/src/users/users.module.ts

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
```

#### backend/src/users/users.service.ts

```typescript
import {
  Injectable,
  ConflictException,
  NotFoundException,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '@pcfs-demo/shared';

@Injectable()
export class UsersService implements OnModuleInit {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seedDefaultAdmin();
  }

  private async seedDefaultAdmin(): Promise<void> {
    const adminEmail = 'admin@example.com';
    const existingAdmin = await this.userRepository.findOne({
      where: { email: adminEmail },
    });

    if (!existingAdmin) {
      const admin = this.userRepository.create({
        email: adminEmail,
        password: 'admin123', // Will be hashed by @BeforeInsert hook
        name: 'Administrator',
        roles: [Role.ADMIN, Role.USER],
        isActive: true,
      });
      await this.userRepository.save(admin);
      this.logger.log('Default admin user created');
    }
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const user = this.userRepository.create({
      email: createUserDto.email,
      password: createUserDto.password, // Will be hashed by @BeforeInsert hook
      name: createUserDto.name,
      roles: createUserDto.roles ?? [Role.USER],
      isActive: createUserDto.isActive ?? true,
    });

    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: updateUserDto.email },
      });
      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }
    }

    // Update fields
    if (updateUserDto.email) user.email = updateUserDto.email;
    if (updateUserDto.name) user.name = updateUserDto.name;
    if (updateUserDto.roles) user.roles = updateUserDto.roles;
    if (updateUserDto.isActive !== undefined) user.isActive = updateUserDto.isActive;

    // Handle password update using entity method
    if (updateUserDto.password) {
      user.setPassword(updateUserDto.password);
    }

    return this.userRepository.save(user);
  }

  async remove(id: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.remove(user);
    return true;
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return user.validatePassword(password);
  }
}
```

#### backend/src/auth/dto/login.dto.ts

```typescript
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(1)
  password: string;
}
```

#### backend/src/auth/dto/refresh-token.dto.ts

```typescript
import { IsString } from 'class-validator';

export class RefreshTokenDto {
  @IsString()
  refreshToken: string;
}
```

#### backend/src/auth/decorators/public.decorator.ts

```typescript
import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
```

#### backend/src/auth/decorators/roles.decorator.ts

```typescript
import { SetMetadata } from '@nestjs/common';
import { Role } from '@pcfs-demo/shared';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
```

#### backend/src/auth/decorators/current-user.decorator.ts

```typescript
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<{ user?: Record<string, unknown> }>();
    const user = request.user;

    if (!user) {
      return null;
    }

    return data ? user[data] : user;
  },
);
```

#### backend/src/auth/guards/jwt-auth.guard.ts

```typescript
import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // Check if route is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest<TUser = unknown>(err: Error | null, user: TUser | false, info: Error | undefined): TUser {
    if (err || !user) {
      throw err || new UnauthorizedException(info?.message ?? 'Unauthorized');
    }
    return user;
  }
}
```

#### backend/src/auth/guards/jwt-refresh.guard.ts

```typescript
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {
  handleRequest<TUser = unknown>(err: Error | null, user: TUser | false, info: Error | undefined): TUser {
    if (err || !user) {
      throw err || new UnauthorizedException(info?.message ?? 'Invalid refresh token');
    }
    return user;
  }
}
```

#### backend/src/auth/guards/roles.guard.ts

```typescript
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '@pcfs-demo/shared';

interface RequestUser {
  userId: string;
  email: string;
  roles: string[];
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{ user?: RequestUser }>();
    const user = request.user;

    if (!user) {
      return false;
    }

    return requiredRoles.some((role) => user.roles.includes(role));
  }
}
```

#### backend/src/auth/token-blacklist.service.ts

```typescript
import { Injectable } from '@nestjs/common';

@Injectable()
export class TokenBlacklistService {
  // In-memory blacklist - replace with Redis in production
  private readonly blacklist: Set<string> = new Set();
  private readonly tokenExpiry: Map<string, number> = new Map();

  /**
   * Add a token to the blacklist
   * @param token - The token to blacklist
   * @param expiresAt - When the token expires (for cleanup)
   */
  add(token: string, expiresAt?: number): void {
    this.blacklist.add(token);
    if (expiresAt) {
      this.tokenExpiry.set(token, expiresAt);
    }
    // Clean up expired tokens periodically
    this.cleanup();
  }

  /**
   * Check if a token is blacklisted
   * @param token - The token to check
   * @returns true if blacklisted
   */
  isBlacklisted(token: string): boolean {
    return this.blacklist.has(token);
  }

  /**
   * Remove expired tokens from the blacklist
   */
  private cleanup(): void {
    const now = Math.floor(Date.now() / 1000);
    for (const [token, expiresAt] of this.tokenExpiry.entries()) {
      if (expiresAt < now) {
        this.blacklist.delete(token);
        this.tokenExpiry.delete(token);
      }
    }
  }

  /**
   * Get the count of blacklisted tokens (for monitoring)
   */
  getCount(): number {
    return this.blacklist.size;
  }
}
```

#### backend/src/auth/strategies/jwt.strategy.ts

```typescript
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { TokenPayload } from '@pcfs-demo/shared';
import { UsersService } from '@/users/users.service';
import { TokenBlacklistService } from '../token-blacklist.service';

// Re-export for backward compatibility
export type { TokenPayload as JwtPayload } from '@pcfs-demo/shared';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly tokenBlacklistService: TokenBlacklistService,
  ) {
    const secretOrKey = configService.get<string>('JWT_SECRET') ?? 'default-secret-change-in-production';
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: TokenPayload) {
    // Extract token from header
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    // Check if token is blacklisted
    if (token && this.tokenBlacklistService.isBlacklisted(token)) {
      throw new UnauthorizedException('Token has been revoked');
    }

    // Only allow access tokens for regular authentication
    if (payload.type !== 'access') {
      throw new UnauthorizedException('Invalid token type');
    }

    // Verify user still exists and is active
    const user = await this.usersService.findById(payload.sub);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found or inactive');
    }

    return {
      userId: payload.sub,
      email: payload.email,
      roles: payload.roles,
    };
  }
}
```

#### backend/src/auth/strategies/jwt-refresh.strategy.ts

```typescript
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { TokenPayload } from '@pcfs-demo/shared';
import { UsersService } from '@/users/users.service';
import { TokenBlacklistService } from '../token-blacklist.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly tokenBlacklistService: TokenBlacklistService,
  ) {
    const secretOrKey = configService.get<string>('JWT_REFRESH_SECRET') ?? 'default-refresh-secret-change-in-production';
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      ignoreExpiration: false,
      secretOrKey,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: TokenPayload) {
    const refreshToken = req.body?.refreshToken as string | undefined;

    // Check if token is blacklisted
    if (refreshToken && this.tokenBlacklistService.isBlacklisted(refreshToken)) {
      throw new UnauthorizedException('Refresh token has been revoked');
    }

    // Only allow refresh tokens
    if (payload.type !== 'refresh') {
      throw new UnauthorizedException('Invalid token type');
    }

    // Verify user still exists and is active
    const user = await this.usersService.findById(payload.sub);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found or inactive');
    }

    return {
      userId: payload.sub,
      email: payload.email,
      roles: payload.roles,
      refreshToken,
    };
  }
}
```

#### backend/src/auth/auth.service.ts

```typescript
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '@/users/users.service';
import { TokenBlacklistService } from './token-blacklist.service';
import { AuditLogService } from '@/audit-log/audit-log.service';
import { AuditAction } from '@/audit-log/schemas/audit-log.schema';
import { LoginDto } from './dto/login.dto';
import type { TokenPayload } from '@pcfs-demo/shared';
import type { StringValue } from 'ms';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse extends TokenPair {
  user: {
    id: string;
    email: string;
    name: string;
    roles: string[];
  };
}

export interface RequestContext {
  ipAddress?: string;
  userAgent?: string;
}

@Injectable()
export class AuthService {
  private readonly accessTokenExpiry: string;
  private readonly refreshTokenExpiry: string;
  private readonly refreshSecret: string;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly tokenBlacklistService: TokenBlacklistService,
    private readonly auditLogService: AuditLogService,
  ) {
    this.accessTokenExpiry = this.configService.get<string>('JWT_ACCESS_EXPIRY') ?? '15m';
    this.refreshTokenExpiry = this.configService.get<string>('JWT_REFRESH_EXPIRY') ?? '7d';
    this.refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET') ?? 'default-refresh-secret-change-in-production';
  }

  async login(loginDto: LoginDto, context?: RequestContext): Promise<AuthResponse> {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user) {
      // Log failed login attempt
      await this.auditLogService.log(
        'unknown',
        loginDto.email,
        AuditAction.LOGIN_FAILED,
        'auth',
        {
          details: { reason: 'User not found' },
          ipAddress: context?.ipAddress,
          userAgent: context?.userAgent,
        },
      );
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      // Log failed login attempt for deactivated account
      await this.auditLogService.log(
        user.id,
        user.email,
        AuditAction.LOGIN_FAILED,
        'auth',
        {
          details: { reason: 'Account deactivated' },
          ipAddress: context?.ipAddress,
          userAgent: context?.userAgent,
        },
      );
      throw new UnauthorizedException('Account is deactivated');
    }

    const isPasswordValid = await this.usersService.validatePassword(
      user,
      loginDto.password,
    );

    if (!isPasswordValid) {
      // Log failed login attempt
      await this.auditLogService.log(
        user.id,
        user.email,
        AuditAction.LOGIN_FAILED,
        'auth',
        {
          details: { reason: 'Invalid password' },
          ipAddress: context?.ipAddress,
          userAgent: context?.userAgent,
        },
      );
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user.id, user.email, user.roles);

    // Log successful login
    await this.auditLogService.log(
      user.id,
      user.email,
      AuditAction.LOGIN,
      'auth',
      {
        ipAddress: context?.ipAddress,
        userAgent: context?.userAgent,
      },
    );

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        roles: user.roles,
      },
    };
  }

  async refreshTokens(userId: string, email: string, roles: string[], oldRefreshToken: string): Promise<TokenPair> {
    // Blacklist the old refresh token
    const decoded = this.jwtService.decode(oldRefreshToken) as { exp?: number } | null;
    if (decoded?.exp) {
      this.tokenBlacklistService.add(oldRefreshToken, decoded.exp);
    }

    // Generate new token pair
    return this.generateTokens(userId, email, roles);
  }

  async logout(
    userId: string,
    email: string,
    accessToken?: string,
    refreshToken?: string,
    context?: RequestContext,
  ): Promise<void> {
    // Blacklist access token if provided
    if (accessToken) {
      const decoded = this.jwtService.decode(accessToken) as { exp?: number } | null;
      if (decoded?.exp) {
        this.tokenBlacklistService.add(accessToken, decoded.exp);
      }
    }

    // Blacklist refresh token if provided
    if (refreshToken) {
      const decoded = this.jwtService.decode(refreshToken) as { exp?: number } | null;
      if (decoded?.exp) {
        this.tokenBlacklistService.add(refreshToken, decoded.exp);
      }
    }

    // Log logout action
    await this.auditLogService.log(
      userId,
      email,
      AuditAction.LOGOUT,
      'auth',
      {
        ipAddress: context?.ipAddress,
        userAgent: context?.userAgent,
      },
    );
  }

  private async generateTokens(userId: string, email: string, roles: string[]): Promise<TokenPair> {
    const accessPayload: TokenPayload = {
      sub: userId,
      email,
      roles,
      type: 'access',
    };

    const refreshPayload: TokenPayload = {
      sub: userId,
      email,
      roles,
      type: 'refresh',
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(accessPayload, {
        expiresIn: this.accessTokenExpiry as StringValue,
      }),
      this.jwtService.signAsync(refreshPayload, {
        secret: this.refreshSecret,
        expiresIn: this.refreshTokenExpiry as StringValue,
      }),
    ]);

    return { accessToken, refreshToken };
  }

  async validateUser(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user || !user.isActive) {
      return null;
    }
    return user.toSafeObject();
  }
}
```

#### backend/src/auth/auth.controller.ts

```typescript
import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
  Get,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService, RequestContext } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { CurrentUser } from './decorators/current-user.decorator';

interface AuthenticatedUser {
  userId: string;
  email: string;
  roles: string[];
  refreshToken?: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private getRequestContext(req: Request): RequestContext {
    return {
      ipAddress: req.ip || req.socket.remoteAddress,
      userAgent: req.headers['user-agent'],
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto, @Req() req: Request) {
    return this.authService.login(loginDto, this.getRequestContext(req));
  }

  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  @HttpCode(HttpStatus.OK)
  async refresh(
    @CurrentUser() user: AuthenticatedUser,
    @Body() refreshTokenDto: RefreshTokenDto,
  ) {
    return this.authService.refreshTokens(
      user.userId,
      user.email,
      user.roles,
      refreshTokenDto.refreshToken,
    );
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() req: Request,
    @CurrentUser() user: AuthenticatedUser,
    @Body('refreshToken') refreshToken?: string,
  ) {
    const authHeader = req.headers.authorization;
    const accessToken = authHeader?.split(' ')[1];

    await this.authService.logout(
      user.userId,
      user.email,
      accessToken,
      refreshToken,
      this.getRequestContext(req),
    );

    return { message: 'Logged out successfully' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser() user: AuthenticatedUser) {
    const fullUser = await this.authService.validateUser(user.userId);
    return fullUser;
  }
}
```

#### backend/src/auth/auth.module.ts

```typescript
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { TokenBlacklistService } from './token-blacklist.service';
import { UsersModule } from '@/users/users.module';
import { AuditLogModule } from '@/audit-log/audit-log.module';

@Module({
  imports: [
    UsersModule,
    AuditLogModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') ?? 'default-secret-change-in-production',
        signOptions: {
          expiresIn: configService.get<string>('JWT_ACCESS_EXPIRY') ?? '15m',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    JwtRefreshStrategy,
    TokenBlacklistService,
  ],
  exports: [AuthService, TokenBlacklistService],
})
export class AuthModule {}
```

#### backend/src/admin/admin.module.ts

```typescript
import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { UsersModule } from '@/users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [AdminController],
})
export class AdminModule {}
```

#### backend/src/admin/admin.controller.ts

```typescript
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '@/users/users.service';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { UpdateUserDto } from '@/users/dto/update-user.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { Roles } from '@/auth/decorators/roles.decorator';
import { Role } from '@pcfs-demo/shared';

@Controller('admin/users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll() {
    const users = await this.usersService.findAll();
    return users.map((user) => user.toSafeObject());
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user.toSafeObject();
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return user.toSafeObject();
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.usersService.update(id, updateUserDto);
    return user.toSafeObject();
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.usersService.remove(id);
  }

  @Post(':id/activate')
  async activate(@Param('id') id: string) {
    const user = await this.usersService.update(id, { isActive: true });
    return user.toSafeObject();
  }

  @Post(':id/deactivate')
  async deactivate(@Param('id') id: string) {
    const user = await this.usersService.update(id, { isActive: false });
    return user.toSafeObject();
  }

  @Put(':id/roles')
  async updateRoles(@Param('id') id: string, @Body('roles') roles: Role[]) {
    const user = await this.usersService.update(id, { roles });
    return user.toSafeObject();
  }
}
```

#### backend/src/audit-log/schemas/audit-log.schema.ts

```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AuditLogDocument = HydratedDocument<AuditLog>;

export enum AuditAction {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  LOGIN = 'login',
  LOGOUT = 'logout',
  LOGIN_FAILED = 'login_failed',
}

@Schema({ timestamps: true, collection: 'audit_logs' })
export class AuditLog {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  userEmail: string;

  @Prop({ required: true, enum: AuditAction })
  action: AuditAction;

  @Prop({ required: true })
  resource: string;

  @Prop()
  resourceId?: string;

  @Prop({ type: Object })
  details?: Record<string, unknown>;

  @Prop()
  ipAddress?: string;

  @Prop()
  userAgent?: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);

// Index for efficient querying
AuditLogSchema.index({ userId: 1, createdAt: -1 });
AuditLogSchema.index({ action: 1, createdAt: -1 });
AuditLogSchema.index({ resource: 1, resourceId: 1 });
```

#### backend/src/audit-log/audit-log.service.ts

```typescript
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuditLog, AuditLogDocument, AuditAction } from './schemas/audit-log.schema';

export interface CreateAuditLogDto {
  userId: string;
  userEmail: string;
  action: AuditAction;
  resource: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

export interface AuditLogQuery {
  userId?: string;
  action?: AuditAction;
  resource?: string;
  resourceId?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}

@Injectable()
export class AuditLogService {
  constructor(
    @InjectModel(AuditLog.name)
    private readonly auditLogModel: Model<AuditLogDocument>,
  ) {}

  async create(createAuditLogDto: CreateAuditLogDto): Promise<AuditLog> {
    const auditLog = new this.auditLogModel(createAuditLogDto);
    return auditLog.save();
  }

  async findAll(query: AuditLogQuery = {}): Promise<AuditLog[]> {
    const { userId, action, resource, resourceId, startDate, endDate, limit = 100, offset = 0 } = query;

    const filter: Record<string, unknown> = {};

    if (userId) filter.userId = userId;
    if (action) filter.action = action;
    if (resource) filter.resource = resource;
    if (resourceId) filter.resourceId = resourceId;

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) (filter.createdAt as Record<string, Date>).$gte = startDate;
      if (endDate) (filter.createdAt as Record<string, Date>).$lte = endDate;
    }

    return this.auditLogModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .exec();
  }

  async findByUser(userId: string, limit = 50): Promise<AuditLog[]> {
    return this.auditLogModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  async findByResource(resource: string, resourceId?: string, limit = 50): Promise<AuditLog[]> {
    const filter: Record<string, string> = { resource };
    if (resourceId) filter.resourceId = resourceId;

    return this.auditLogModel
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  async countByAction(action: AuditAction, startDate?: Date, endDate?: Date): Promise<number> {
    const filter: Record<string, unknown> = { action };

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) (filter.createdAt as Record<string, Date>).$gte = startDate;
      if (endDate) (filter.createdAt as Record<string, Date>).$lte = endDate;
    }

    return this.auditLogModel.countDocuments(filter).exec();
  }

  async log(
    userId: string,
    userEmail: string,
    action: AuditAction,
    resource: string,
    options?: {
      resourceId?: string;
      details?: Record<string, unknown>;
      ipAddress?: string;
      userAgent?: string;
    },
  ): Promise<AuditLog> {
    return this.create({
      userId,
      userEmail,
      action,
      resource,
      ...options,
    });
  }
}
```

#### backend/src/audit-log/audit-log.controller.ts

```typescript
import {
  Controller,
  Get,
  Query,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AuditLogService, AuditLogQuery } from './audit-log.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { Roles } from '@/auth/decorators/roles.decorator';
import { Role } from '@pcfs-demo/shared';
import { AuditAction } from './schemas/audit-log.schema';

@Controller('admin/audit-logs')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Get()
  async findAll(
    @Query('userId') userId?: string,
    @Query('action') action?: AuditAction,
    @Query('resource') resource?: string,
    @Query('resourceId') resourceId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const query: AuditLogQuery = {
      userId,
      action,
      resource,
      resourceId,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      limit: limit ? parseInt(limit, 10) : 100,
      offset: offset ? parseInt(offset, 10) : 0,
    };

    return this.auditLogService.findAll(query);
  }

  @Get('user/:userId')
  async findByUser(
    @Param('userId') userId: string,
    @Query('limit') limit?: string,
  ) {
    return this.auditLogService.findByUser(userId, limit ? parseInt(limit, 10) : 50);
  }

  @Get('resource/:resource')
  async findByResource(
    @Param('resource') resource: string,
    @Query('resourceId') resourceId?: string,
    @Query('limit') limit?: string,
  ) {
    return this.auditLogService.findByResource(
      resource,
      resourceId,
      limit ? parseInt(limit, 10) : 50,
    );
  }

  @Get('stats/:action')
  async getActionStats(
    @Param('action') action: AuditAction,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const count = await this.auditLogService.countByAction(
      action,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );

    return { action, count };
  }
}
```

#### backend/src/audit-log/audit-log.module.ts

```typescript
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuditLog, AuditLogSchema } from './schemas/audit-log.schema';
import { AuditLogService } from './audit-log.service';
import { AuditLogController } from './audit-log.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AuditLog.name, schema: AuditLogSchema },
    ]),
  ],
  controllers: [AuditLogController],
  providers: [AuditLogService],
  exports: [AuditLogService],
})
export class AuditLogModule {}
```

### 5.7 Storage Module (SeaweedFS/S3)

The Storage module provides file upload/download functionality using SeaweedFS (S3-compatible).

#### backend/src/storage/config/s3.config.ts

```typescript
import { S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

export const createS3Client = (configService: ConfigService): S3Client => {
  const host = configService.get<string>('SEAWEEDFS_HOST', 'localhost');
  const port = configService.get<number>('SEAWEEDFS_S3_PORT', 8333);

  return new S3Client({
    endpoint: `http://${host}:${port}`,
    region: 'us-east-1', // SeaweedFS requires a region but doesn't use it
    credentials: {
      accessKeyId: configService.get<string>('SEAWEEDFS_ACCESS_KEY', ''),
      secretAccessKey: configService.get<string>('SEAWEEDFS_SECRET_KEY', ''),
    },
    forcePathStyle: true, // Required for SeaweedFS S3 compatibility
  });
};

export const S3_CLIENT = 'S3_CLIENT';
export const DEFAULT_BUCKET = 'files';
```

#### backend/src/storage/schemas/file-metadata.schema.ts

```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type FileMetadataDocument = HydratedDocument<FileMetadata>;

export enum FileVisibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

@Schema({ timestamps: true, collection: 'file_metadata' })
export class FileMetadata {
  @Prop({ required: true })
  originalName!: string;

  @Prop({ required: true, unique: true })
  storageKey!: string; // S3 key (path in SeaweedFS)

  @Prop({ required: true })
  mimeType!: string;

  @Prop({ required: true })
  size!: number; // bytes

  @Prop({
    required: true,
    enum: FileVisibility,
    default: FileVisibility.PRIVATE,
  })
  visibility!: FileVisibility;

  @Prop({ required: true })
  uploadedBy!: string; // userId

  @Prop()
  uploadedByEmail!: string;

  @Prop()
  description?: string;

  @Prop({ type: [String], default: [] })
  tags!: string[];

  @Prop()
  folder?: string; // Virtual folder organization

  @Prop({ type: Object })
  customMetadata?: Record<string, unknown>;

  @Prop()
  contentHash?: string; // For deduplication/integrity

  @Prop({ default: Date.now })
  createdAt!: Date;

  @Prop({ default: Date.now })
  updatedAt!: Date;
}

export const FileMetadataSchema = SchemaFactory.createForClass(FileMetadata);

// Indexes for efficient querying
FileMetadataSchema.index({ uploadedBy: 1, createdAt: -1 });
FileMetadataSchema.index({ visibility: 1 });
FileMetadataSchema.index({ folder: 1, createdAt: -1 });
FileMetadataSchema.index({ tags: 1 });
FileMetadataSchema.index({ storageKey: 1 }, { unique: true });
```

#### backend/src/storage/dto/upload-file.dto.ts

```typescript
import {
  IsString,
  IsOptional,
  IsArray,
  IsEnum,
  MaxLength,
} from 'class-validator';
import { FileVisibility } from '../schemas/file-metadata.schema';

export class UploadFileDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  @MaxLength(255)
  folder?: string;

  @IsOptional()
  @IsEnum(FileVisibility)
  visibility?: FileVisibility;
}
```

#### backend/src/storage/dto/update-file.dto.ts

```typescript
import {
  IsString,
  IsOptional,
  IsArray,
  IsEnum,
  MaxLength,
} from 'class-validator';
import { FileVisibility } from '../schemas/file-metadata.schema';

export class UpdateFileDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  @MaxLength(255)
  folder?: string;

  @IsOptional()
  @IsEnum(FileVisibility)
  visibility?: FileVisibility;
}
```

#### backend/src/storage/dto/file-query.dto.ts

```typescript
import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  Min,
  Max,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { FileVisibility } from '../schemas/file-metadata.schema';

export class FileQueryDto {
  @IsOptional()
  @IsString()
  folder?: string;

  @IsOptional()
  @IsEnum(FileVisibility)
  visibility?: FileVisibility;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  search?: string; // Search in originalName, description

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  offset?: number = 0;
}
```

#### backend/src/storage/storage.service.ts

```typescript
import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadBucketCommand,
  CreateBucketCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import {
  FileMetadata,
  FileMetadataDocument,
  FileVisibility,
} from './schemas/file-metadata.schema';
import { UploadFileDto } from './dto/upload-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { FileQueryDto } from './dto/file-query.dto';
import { S3_CLIENT, DEFAULT_BUCKET } from './config/s3.config';

export interface UploadedFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}

export interface DownloadResult {
  stream: NodeJS.ReadableStream;
  metadata: FileMetadata;
}

@Injectable()
export class StorageService implements OnModuleInit {
  private readonly logger = new Logger(StorageService.name);
  private readonly bucket: string;

  constructor(
    @Inject(S3_CLIENT)
    private readonly s3Client: S3Client,
    @InjectModel(FileMetadata.name)
    private readonly fileMetadataModel: Model<FileMetadataDocument>,
    private readonly configService: ConfigService,
  ) {
    this.bucket = this.configService.get<string>(
      'SEAWEEDFS_BUCKET',
      DEFAULT_BUCKET,
    );
  }

  async onModuleInit(): Promise<void> {
    await this.ensureBucketExists();
  }

  private async ensureBucketExists(): Promise<void> {
    try {
      await this.s3Client.send(new HeadBucketCommand({ Bucket: this.bucket }));
      this.logger.log(`Bucket '${this.bucket}' exists`);
    } catch (error) {
      if ((error as { name?: string }).name === 'NotFound') {
        this.logger.log(`Creating bucket '${this.bucket}'...`);
        await this.s3Client.send(
          new CreateBucketCommand({ Bucket: this.bucket }),
        );
        this.logger.log(`Bucket '${this.bucket}' created`);
      } else {
        this.logger.warn(`Could not verify bucket: ${error}`);
      }
    }
  }

  private generateStorageKey(originalName: string, folder?: string): string {
    const ext = originalName.includes('.')
      ? originalName.substring(originalName.lastIndexOf('.'))
      : '';
    const uuid = uuidv4();
    const prefix = folder ? `${folder}/` : '';
    return `${prefix}${uuid}${ext}`;
  }

  async upload(
    file: UploadedFile,
    uploadDto: UploadFileDto,
    userId: string,
    userEmail: string,
  ): Promise<FileMetadata> {
    const storageKey = this.generateStorageKey(
      file.originalname,
      uploadDto.folder,
    );

    // Upload to SeaweedFS
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: storageKey,
        Body: file.buffer,
        ContentType: file.mimetype,
        Metadata: {
          originalName: file.originalname,
          uploadedBy: userId,
        },
      }),
    );

    // Save metadata to MongoDB
    const metadata = new this.fileMetadataModel({
      originalName: file.originalname,
      storageKey,
      mimeType: file.mimetype,
      size: file.size,
      visibility: uploadDto.visibility ?? FileVisibility.PRIVATE,
      uploadedBy: userId,
      uploadedByEmail: userEmail,
      description: uploadDto.description,
      tags: uploadDto.tags ?? [],
      folder: uploadDto.folder,
    });

    return metadata.save();
  }

  async findById(
    id: string,
    userId?: string,
    checkOwnership = true,
  ): Promise<FileMetadata> {
    const metadata = await this.fileMetadataModel.findById(id).exec();

    if (!metadata) {
      throw new NotFoundException('File not found');
    }

    // Check access: public files can be accessed by anyone
    // Private files require ownership check
    if (
      checkOwnership &&
      metadata.visibility === FileVisibility.PRIVATE &&
      metadata.uploadedBy !== userId
    ) {
      throw new ForbiddenException('Access denied');
    }

    return metadata;
  }

  async download(id: string, userId?: string): Promise<DownloadResult> {
    const metadata = await this.findById(id, userId);

    const response = await this.s3Client.send(
      new GetObjectCommand({
        Bucket: this.bucket,
        Key: metadata.storageKey,
      }),
    );

    if (!response.Body) {
      throw new NotFoundException('File content not found');
    }

    // Convert to Node.js readable stream
    const stream = response.Body as NodeJS.ReadableStream;

    return {
      stream,
      metadata,
    };
  }

  async getPresignedUrl(
    id: string,
    userId?: string,
    expiresIn = 3600,
  ): Promise<string> {
    const metadata = await this.findById(id, userId);

    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: metadata.storageKey,
    });

    return getSignedUrl(this.s3Client, command, { expiresIn });
  }

  async findAll(
    query: FileQueryDto,
    userId?: string,
  ): Promise<{
    files: FileMetadata[];
    total: number;
  }> {
    const filter: Record<string, unknown> = {};

    // Non-authenticated users can only see public files
    if (!userId) {
      filter.visibility = FileVisibility.PUBLIC;
    } else if (query.visibility) {
      // Authenticated users can filter by visibility
      // But can only see their own private files
      if (query.visibility === FileVisibility.PRIVATE) {
        filter.visibility = FileVisibility.PRIVATE;
        filter.uploadedBy = userId;
      } else {
        filter.visibility = FileVisibility.PUBLIC;
      }
    } else {
      // Default: show user's files + all public files
      filter.$or = [
        { uploadedBy: userId },
        { visibility: FileVisibility.PUBLIC },
      ];
    }

    if (query.folder) {
      filter.folder = query.folder;
    }

    if (query.tags && query.tags.length > 0) {
      filter.tags = { $all: query.tags };
    }

    if (query.search) {
      const searchFilter = {
        $or: [
          { originalName: { $regex: query.search, $options: 'i' } },
          { description: { $regex: query.search, $options: 'i' } },
        ],
      };
      // Merge search filter with existing filter
      if (filter.$or) {
        filter.$and = [{ $or: filter.$or }, searchFilter];
        delete filter.$or;
      } else {
        Object.assign(filter, searchFilter);
      }
    }

    const [files, total] = await Promise.all([
      this.fileMetadataModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(query.offset ?? 0)
        .limit(query.limit ?? 20)
        .exec(),
      this.fileMetadataModel.countDocuments(filter).exec(),
    ]);

    return { files, total };
  }

  async update(
    id: string,
    updateDto: UpdateFileDto,
    userId: string,
  ): Promise<FileMetadata> {
    const metadata = await this.fileMetadataModel.findById(id).exec();

    if (!metadata) {
      throw new NotFoundException('File not found');
    }

    if (metadata.uploadedBy !== userId) {
      throw new ForbiddenException('Only the file owner can update metadata');
    }

    // Update only provided fields
    if (updateDto.description !== undefined) {
      metadata.description = updateDto.description;
    }
    if (updateDto.tags !== undefined) {
      metadata.tags = updateDto.tags;
    }
    if (updateDto.folder !== undefined) {
      metadata.folder = updateDto.folder;
    }
    if (updateDto.visibility !== undefined) {
      metadata.visibility = updateDto.visibility;
    }

    return metadata.save();
  }

  async delete(id: string, userId: string): Promise<void> {
    const metadata = await this.fileMetadataModel.findById(id).exec();

    if (!metadata) {
      throw new NotFoundException('File not found');
    }

    if (metadata.uploadedBy !== userId) {
      throw new ForbiddenException('Only the file owner can delete this file');
    }

    // Delete from SeaweedFS
    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: metadata.storageKey,
      }),
    );

    // Delete metadata from MongoDB
    await this.fileMetadataModel.findByIdAndDelete(id).exec();
  }

  async findByUser(userId: string, limit = 50): Promise<FileMetadata[]> {
    return this.fileMetadataModel
      .find({ uploadedBy: userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }
}
```

#### backend/src/storage/storage.controller.ts

```typescript
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Res,
  StreamableFile,
  ParseFilePipe,
  MaxFileSizeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { Readable } from 'stream';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { Public } from '@/auth/decorators/public.decorator';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import {
  StorageService,
  UploadedFile as IUploadedFile,
} from './storage.service';
import { UploadFileDto } from './dto/upload-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { FileQueryDto } from './dto/file-query.dto';
import { FileVisibility } from './schemas/file-metadata.schema';

// User type from JWT payload (matches existing pattern)
interface JwtUser {
  id: string;
  email: string;
  roles: string[];
}

@Controller('files')
@UseGuards(JwtAuthGuard)
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 50 * 1024 * 1024 }), // 50MB
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() uploadDto: UploadFileDto,
    @CurrentUser() user: JwtUser,
  ) {
    const uploadedFile: IUploadedFile = {
      buffer: file.buffer,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    };

    return this.storageService.upload(
      uploadedFile,
      uploadDto,
      user.id,
      user.email,
    );
  }

  @Get()
  async findAll(
    @Query() query: FileQueryDto,
    @CurrentUser() user: JwtUser | null,
  ) {
    return this.storageService.findAll(query, user?.id);
  }

  @Public()
  @Get('public')
  async findPublic(@Query() query: FileQueryDto) {
    // Force public visibility for unauthenticated access
    query.visibility = FileVisibility.PUBLIC;
    return this.storageService.findAll(query);
  }

  @Get('user/my-files')
  async getMyFiles(@CurrentUser() user: JwtUser) {
    return this.storageService.findByUser(user.id);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: JwtUser | null,
  ) {
    return this.storageService.findById(id, user?.id);
  }

  @Public()
  @Get(':id/public')
  async findOnePublic(@Param('id') id: string) {
    // Only returns if file is public
    return this.storageService.findById(id, undefined, true);
  }

  @Get(':id/download')
  async download(
    @Param('id') id: string,
    @CurrentUser() user: JwtUser | null,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const result = await this.storageService.download(id, user?.id);

    res.set({
      'Content-Type': result.metadata.mimeType,
      'Content-Disposition': `attachment; filename="${result.metadata.originalName}"`,
      'Content-Length': result.metadata.size,
    });

    const nodeStream = Readable.fromWeb(result.stream as unknown as import('stream/web').ReadableStream);
    return new StreamableFile(nodeStream);
  }

  @Public()
  @Get(':id/download/public')
  async downloadPublic(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const result = await this.storageService.download(id, undefined);

    res.set({
      'Content-Type': result.metadata.mimeType,
      'Content-Disposition': `attachment; filename="${result.metadata.originalName}"`,
      'Content-Length': result.metadata.size,
    });

    const nodeStream = Readable.fromWeb(result.stream as unknown as import('stream/web').ReadableStream);
    return new StreamableFile(nodeStream);
  }

  @Get(':id/url')
  async getPresignedUrl(
    @Param('id') id: string,
    @Query('expiresIn') expiresIn: number,
    @CurrentUser() user: JwtUser,
  ) {
    const url = await this.storageService.getPresignedUrl(
      id,
      user.id,
      expiresIn || 3600,
    );
    return { url, expiresIn: expiresIn || 3600 };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateFileDto,
    @CurrentUser() user: JwtUser,
  ) {
    return this.storageService.update(id, updateDto, user.id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @CurrentUser() user: JwtUser) {
    await this.storageService.delete(id, user.id);
    return { message: 'File deleted successfully' };
  }
}
```

#### backend/src/storage/storage.module.ts

```typescript
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { StorageController } from './storage.controller';
import { StorageService } from './storage.service';
import {
  FileMetadata,
  FileMetadataSchema,
} from './schemas/file-metadata.schema';
import { createS3Client, S3_CLIENT } from './config/s3.config';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FileMetadata.name, schema: FileMetadataSchema },
    ]),
    MulterModule.register({
      storage: memoryStorage(),
    }),
    ConfigModule,
  ],
  controllers: [StorageController],
  providers: [
    StorageService,
    {
      provide: S3_CLIENT,
      useFactory: (configService: ConfigService) =>
        createS3Client(configService),
      inject: [ConfigService],
    },
  ],
  exports: [StorageService],
})
export class StorageModule {}
```

**Note:** The Storage module requires the following additional dependencies in backend/package.json:

```json
"@aws-sdk/client-s3": "^3.682.0",
"@aws-sdk/s3-request-presigner": "^3.682.0"
```

#### backend/src/app.controller.spec.ts

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
```

#### backend/test/jest-e2e.json

```json
{
  "moduleFileExtensions": ["js", "json", "ts"],
  "rootDir": ".",
  "testEnvironment": "node",
  "testRegex": ".e2e-spec.ts$",
  "transform": {
    "^.+\\.(t|j)s$": "ts-jest"
  }
}
```

#### backend/test/app.e2e-spec.ts

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  afterEach(async () => {
    await app.close();
  });
});
```

Go back to the root directory:

```bash
cd ..
```

---

## 6. Frontend Setup

### 6.1 Create Frontend with Vite CLI

```bash
cd frontend
npm create vite@latest . -- --template react-ts
```

### 6.2 Update frontend/package.json

Replace contents with:

```json
{
  "name": "frontend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "typecheck": "tsc --noEmit",
    "lint": "eslint .",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage"
  },
  "dependencies": {
    "@pcfs-demo/shared": "*",
    "@radix-ui/react-checkbox": "^1.3.2",
    "@radix-ui/react-label": "^2.1.7",
    "@radix-ui/react-slot": "^1.2.3",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "lucide-react": "^0.474.0",
    "react": "^19.2.4",
    "react-dom": "^19.2.4",
    "react-router-dom": "^7.5.0",
    "tailwind-merge": "^3.0.1",
    "tw-animate-css": "^1.2.5",
    "zustand": "^5.0.12"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.2.0",
    "@eslint/js": "^9.39.4",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.3.0",
    "@types/node": "^24.12.2",
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^6.0.1",
    "@vitest/coverage-v8": "^4.1.3",
    "@vitest/ui": "^4.1.3",
    "eslint": "^9.39.4",
    "eslint-plugin-react-hooks": "^7.0.1",
    "eslint-plugin-react-refresh": "^0.5.2",
    "globals": "^17.4.0",
    "jsdom": "^26.1.0",
    "typescript": "~6.0.2",
    "typescript-eslint": "^8.58.0",
    "tailwindcss": "^4.2.0",
    "vite": "^8.0.7",
    "vitest": "^4.1.3"
  }
}
```

### 6.3 Update TypeScript Configuration for TS6

#### frontend/tsconfig.json

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ],
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

#### frontend/tsconfig.app.json

```json
{
  "compilerOptions": {
    /* TypeScript 6 Defaults */
    "target": "ES2025",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "ignoreDeprecations": "6.0",
    /* Vite/Bundler Mode */
    "isolatedModules": true,
    "noEmit": true,
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",

    /* React */
    "jsx": "react-jsx",
    "lib": ["ES2025", "DOM", "DOM.Iterable"],
    "types": ["vite/client"],

    /* Code Quality */
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,

    /* TypeScript 6/7 Preparation */
    "erasableSyntaxOnly": true,
    "stableTypeOrdering": true,

    /* Path Aliases */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },

    /* Build Info */
    "composite": true,
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "skipLibCheck": true
  },
  "include": ["src"]
}
```

#### frontend/tsconfig.node.json

```json
{
  "compilerOptions": {
    /* TypeScript 6 Defaults */
    "target": "ES2025",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,

    /* Bundler Mode */
    "isolatedModules": true,
    "noEmit": true,
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",

    /* Node.js Types for Vite Config */
    "lib": ["ES2025"],
    "types": ["node"],

    /* Code Quality */
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,

    /* TypeScript 6/7 Preparation */
    "erasableSyntaxOnly": true,
    "stableTypeOrdering": true,

    /* Build Info */
    "composite": true,
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
    "skipLibCheck": true
  },
  "include": ["vite.config.ts"]
}
```

### 6.4 Create frontend/vite.config.ts

```typescript
/// <reference types="vitest" />
import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/test/'],
    },
  },
});
```

### 6.5 Create frontend/components.json (shadcn/ui)

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/index.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide",
  "_dependencies": {
    "@radix-ui/react-checkbox": "^1.3.2",
    "@radix-ui/react-label": "^2.1.7",
    "@radix-ui/react-slot": "^1.2.3"
  },
  "_installedComponents": [
    "alert",
    "badge",
    "button",
    "card",
    "checkbox",
    "input",
    "label"
  ]
}
```

**Note:** The `_dependencies` and `_installedComponents` fields are custom additions for tracking purposes. shadcn/ui doesn't maintain an automatic registry.

### 6.6 Create frontend/index.html

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>PCFS Demo - Full-Stack Application</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### 6.7 Create shadcn/ui Components

Create the shadcn/ui components in `frontend/src/components/ui/`:

#### frontend/src/components/ui/button.tsx

```tsx
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        outline: 'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
```

#### frontend/src/components/ui/input.tsx

```tsx
import * as React from 'react';
import { cn } from '@/lib/utils';

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
```

#### frontend/src/components/ui/label.tsx

```tsx
import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const labelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
);

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root ref={ref} className={cn(labelVariants(), className)} {...props} />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
```

#### frontend/src/components/ui/card.tsx

```tsx
import * as React from 'react';
import { cn } from '@/lib/utils';

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('rounded-xl border border-border bg-card text-card-foreground shadow', className)} {...props} />
  )
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
  )
);
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('font-semibold leading-none tracking-tight', className)} {...props} />
  )
);
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
  )
);
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
);
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />
  )
);
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
```

#### frontend/src/components/ui/checkbox.tsx

```tsx
import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      'peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className={cn('flex items-center justify-center text-current')}>
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
```

#### frontend/src/components/ui/badge.tsx

```tsx
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80',
        secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive: 'border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80',
        outline: 'text-foreground',
      },
    },
    defaultVariants: { variant: 'default' },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
```

#### frontend/src/components/ui/alert.tsx

```tsx
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const alertVariants = cva(
  'relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground',
        destructive: 'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive',
      },
    },
    defaultVariants: { variant: 'default' },
  }
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props} />
));
Alert.displayName = 'Alert';

const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5 ref={ref} className={cn('mb-1 font-medium leading-none tracking-tight', className)} {...props} />
  )
);
AlertTitle.displayName = 'AlertTitle';

const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('text-sm [&_p]:leading-relaxed', className)} {...props} />
  )
);
AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertTitle, AlertDescription };
```

### 6.8 Create Frontend Source Files

#### frontend/src/main.tsx

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from '@/App';
import './index.css';

/**
 * Application Entry Point
 *
 * This is the React DOM render entry point.
 * All application logic is delegated to App.tsx.
 *
 * Hierarchy:
 * main.tsx (entry) → App.tsx (init & providers) → Router → Layouts → Pages
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

#### frontend/src/App.tsx

```tsx
import { useEffect, useState, useRef } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/routes';
import { useAuthStore } from '@/stores/authStore';

/**
 * Loading component shown during app initialization
 */
function AppLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

/**
 * Main App component - handles auth state initialization
 */
export default function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const initializationRef = useRef(false);

  const initialize = useAuthStore((state) => state.initialize);
  const refreshTokens = useAuthStore((state) => state.refreshTokens);

  useEffect(() => {
    // Prevent double initialization in React StrictMode
    if (initializationRef.current) {
      return;
    }
    initializationRef.current = true;

    const initializeApp = async () => {
      initialize();

      const { accessToken } = useAuthStore.getState();

      if (accessToken) {
        try {
          const success = await refreshTokens();
          if (!success) {
            console.log('Session expired, user will need to login again');
          }
        } catch {
          console.log('Token validation failed, user will need to login again');
        }
      }

      setIsInitialized(true);
    };

    initializeApp();
  }, [initialize, refreshTokens]);

  if (!isInitialized) {
    return <AppLoader />;
  }

  return <RouterProvider router={router} />;
}
```

#### frontend/src/index.css

```css
@import 'tailwindcss';
@import 'tw-animate-css';

/* shadcn/ui theme variables */
:root {
  --radius: 0.5rem;

  /* Base colors */
  --background: oklch(100% 0 0);
  --foreground: oklch(14.08% 0.004 285.82);

  /* Card */
  --card: oklch(100% 0 0);
  --card-foreground: oklch(14.08% 0.004 285.82);

  /* Popover */
  --popover: oklch(100% 0 0);
  --popover-foreground: oklch(14.08% 0.004 285.82);

  /* Primary */
  --primary: oklch(20.47% 0.006 285.88);
  --primary-foreground: oklch(98.51% 0.001 285.94);

  /* Secondary */
  --secondary: oklch(96.76% 0.001 285.94);
  --secondary-foreground: oklch(20.47% 0.006 285.88);

  /* Muted */
  --muted: oklch(96.76% 0.001 285.94);
  --muted-foreground: oklch(55.19% 0.014 285.94);

  /* Accent */
  --accent: oklch(96.76% 0.001 285.94);
  --accent-foreground: oklch(20.47% 0.006 285.88);

  /* Destructive */
  --destructive: oklch(57.71% 0.215 27.33);
  --destructive-foreground: oklch(98.51% 0.001 285.94);

  /* Border & Input */
  --border: oklch(91.97% 0.004 285.82);
  --input: oklch(91.97% 0.004 285.82);
  --ring: oklch(70.9% 0.01 285.84);

  /* Chart colors */
  --chart-1: oklch(48.77% 0.164 259.73);
  --chart-2: oklch(69.61% 0.132 166.08);
  --chart-3: oklch(42.25% 0.052 285.94);
  --chart-4: oklch(76.81% 0.134 75.36);
  --chart-5: oklch(64.53% 0.222 41.12);

  /* Sidebar */
  --sidebar: oklch(98.51% 0.001 285.94);
  --sidebar-foreground: oklch(14.08% 0.004 285.82);
  --sidebar-primary: oklch(20.47% 0.006 285.88);
  --sidebar-primary-foreground: oklch(98.51% 0.001 285.94);
  --sidebar-accent: oklch(96.76% 0.001 285.94);
  --sidebar-accent-foreground: oklch(20.47% 0.006 285.88);
  --sidebar-border: oklch(91.97% 0.004 285.82);
  --sidebar-ring: oklch(70.9% 0.01 285.84);
}

.dark {
  --background: oklch(14.08% 0.004 285.82);
  --foreground: oklch(98.51% 0.001 285.94);

  --card: oklch(14.08% 0.004 285.82);
  --card-foreground: oklch(98.51% 0.001 285.94);

  --popover: oklch(14.08% 0.004 285.82);
  --popover-foreground: oklch(98.51% 0.001 285.94);

  --primary: oklch(98.51% 0.001 285.94);
  --primary-foreground: oklch(20.47% 0.006 285.88);

  --secondary: oklch(27.39% 0.005 285.88);
  --secondary-foreground: oklch(98.51% 0.001 285.94);

  --muted: oklch(27.39% 0.005 285.88);
  --muted-foreground: oklch(70.9% 0.01 285.84);

  --accent: oklch(27.39% 0.005 285.88);
  --accent-foreground: oklch(98.51% 0.001 285.94);

  --destructive: oklch(57.71% 0.215 27.33);
  --destructive-foreground: oklch(98.51% 0.001 285.94);

  --border: oklch(27.39% 0.005 285.88);
  --input: oklch(27.39% 0.005 285.88);
  --ring: oklch(83.69% 0.005 285.88);

  --chart-1: oklch(69.13% 0.15 252.42);
  --chart-2: oklch(69.61% 0.132 166.08);
  --chart-3: oklch(98.51% 0.001 285.94);
  --chart-4: oklch(76.81% 0.134 75.36);
  --chart-5: oklch(64.53% 0.222 41.12);

  --sidebar: oklch(14.08% 0.004 285.82);
  --sidebar-foreground: oklch(98.51% 0.001 285.94);
  --sidebar-primary: oklch(48.77% 0.164 259.73);
  --sidebar-primary-foreground: oklch(98.51% 0.001 285.94);
  --sidebar-accent: oklch(27.39% 0.005 285.88);
  --sidebar-accent-foreground: oklch(98.51% 0.001 285.94);
  --sidebar-border: oklch(27.39% 0.005 285.88);
  --sidebar-ring: oklch(83.69% 0.005 285.88);
}

/* Tailwind v4 @theme inline - maps CSS vars to Tailwind utilities */
@theme inline {
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);

  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
}

/* Base styles */
* {
  @apply border-border;
}

body {
  @apply bg-background text-foreground;
  font-family: system-ui, 'Segoe UI', Roboto, sans-serif;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

#### frontend/src/lib/utils.ts

```typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

#### frontend/src/lib/api.ts

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface ApiError {
  message: string;
  statusCode: number;
}

class ApiClient {
  private accessToken: string | null = null;

  setAccessToken(token: string | null) {
    this.accessToken = token;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.accessToken) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${this.accessToken}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        message: 'An error occurred',
        statusCode: response.status,
      }));
      throw new Error(error.message || `HTTP error ${response.status}`);
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
export default apiClient;
```

#### frontend/src/routes/index.tsx

```tsx
import { createBrowserRouter, Navigate } from 'react-router-dom';
import RootLayout from '@/layouts/RootLayout';
import DashboardLayout from '@/layouts/DashboardLayout';
import HomePage from '@/pages/HomePage';
import AboutPage from '@/pages/AboutPage';
import LoginPage from '@/pages/LoginPage';
import DashboardPage from '@/pages/DashboardPage';
import UsersListPage from '@/pages/admin/UsersListPage';
import UserCreatePage from '@/pages/admin/UserCreatePage';
import UserEditPage from '@/pages/admin/UserEditPage';
import NotFoundPage from '@/pages/NotFoundPage';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AdminRoute } from '@/components/AdminRoute';

export const router = createBrowserRouter([
  // Public routes with RootLayout (navbar)
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
    ],
  },

  // Login route (standalone, no layout navbar)
  {
    path: '/login',
    element: <LoginPage />,
  },

  // Protected dashboard routes
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      // Admin routes (nested under dashboard)
      {
        path: 'admin/users',
        element: (
          <AdminRoute>
            <UsersListPage />
          </AdminRoute>
        ),
      },
      {
        path: 'admin/users/new',
        element: (
          <AdminRoute>
            <UserCreatePage />
          </AdminRoute>
        ),
      },
      {
        path: 'admin/users/:id',
        element: (
          <AdminRoute>
            <UserEditPage />
          </AdminRoute>
        ),
      },
    ],
  },

  // Redirect /app to /dashboard for convenience
  {
    path: '/app',
    element: <Navigate to="/dashboard" replace />,
  },

  // 404 catch-all
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
```

#### frontend/src/services/auth.service.ts

```typescript
import apiClient from '@/lib/api';
import type {
  UserDto,
  LoginUser,
  LoginRequest,
  LoginResponse,
  RefreshTokenResponse,
} from '@pcfs-demo/shared';

// Re-export shared types for convenience
export type {
  UserDto,
  LoginUser,
  LoginRequest,
  LoginResponse,
  RefreshTokenResponse,
};

// Aliases for backward compatibility
export type User = UserDto;
export type RefreshResponse = RefreshTokenResponse;

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>('/auth/login', credentials);
  },

  async logout(refreshToken?: string): Promise<void> {
    await apiClient.post('/auth/logout', { refreshToken });
  },

  async refreshTokens(refreshToken: string): Promise<RefreshResponse> {
    return apiClient.post<RefreshResponse>('/auth/refresh', { refreshToken });
  },

  async getProfile(): Promise<User> {
    return apiClient.get<User>('/auth/me');
  },
};

export default authService;
```

#### frontend/src/services/users.service.ts

```typescript
import apiClient from '@/lib/api';
import type {
  UserDto,
  CreateUserRequest,
  UpdateUserRequest,
} from '@pcfs-demo/shared';

// Re-export for convenience
export type { UserDto, CreateUserRequest, UpdateUserRequest };

// Alias for backward compatibility
export type User = UserDto;

export const usersService = {
  async getAll(): Promise<UserDto[]> {
    return apiClient.get<UserDto[]>('/admin/users');
  },

  async getById(id: string): Promise<UserDto> {
    return apiClient.get<UserDto>(`/admin/users/${id}`);
  },

  async create(data: CreateUserRequest): Promise<UserDto> {
    return apiClient.post<UserDto>('/admin/users', data);
  },

  async update(id: string, data: UpdateUserRequest): Promise<UserDto> {
    return apiClient.put<UserDto>(`/admin/users/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/admin/users/${id}`);
  },

  async activate(id: string): Promise<UserDto> {
    return apiClient.post<UserDto>(`/admin/users/${id}/activate`);
  },

  async deactivate(id: string): Promise<UserDto> {
    return apiClient.post<UserDto>(`/admin/users/${id}/deactivate`);
  },

  async updateRoles(id: string, roles: string[]): Promise<UserDto> {
    return apiClient.put<UserDto>(`/admin/users/${id}/roles`, { roles });
  },
};

export default usersService;
```

#### frontend/src/stores/authStore.ts

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LoginUser } from '@pcfs-demo/shared';
import apiClient from '@/lib/api';
import authService from '@/services/auth.service';

interface AuthState {
  user: LoginUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshTokens: () => Promise<boolean>;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isAdmin: false,

      initialize: () => {
        const { accessToken } = get();
        if (accessToken) {
          apiClient.setAccessToken(accessToken);
        }
      },

      login: async (email: string, password: string) => {
        try {
          const response = await authService.login({ email, password });

          apiClient.setAccessToken(response.accessToken);

          const { user } = response;
          const isAdmin = user.roles.includes('admin');

          set({
            user,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            isAuthenticated: true,
            isAdmin,
          });

          return true;
        } catch (error) {
          console.error('Login failed:', error);
          return false;
        }
      },

      logout: async () => {
        const { refreshToken, accessToken } = get();

        try {
          if (accessToken) {
            await authService.logout(refreshToken ?? undefined);
          }
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          apiClient.setAccessToken(null);
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isAdmin: false,
          });
        }
      },

      refreshTokens: async () => {
        const { refreshToken } = get();

        if (!refreshToken) {
          return false;
        }

        try {
          const response = await authService.refreshTokens(refreshToken);

          apiClient.setAccessToken(response.accessToken);

          set({
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
          });

          return true;
        } catch (error) {
          console.error('Token refresh failed:', error);
          apiClient.setAccessToken(null);
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isAdmin: false,
          });
          return false;
        }
      },
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        if (state?.accessToken) {
          apiClient.setAccessToken(state.accessToken);
        }
      },
    }
  )
);
```

#### frontend/src/test/setup.ts

```typescript
import '@testing-library/jest-dom';
```

**Note:** Additional frontend files (layouts, pages, components) should be created following the patterns established above. Key files include:

- `frontend/src/layouts/RootLayout.tsx` - Public layout with Navbar
- `frontend/src/layouts/DashboardLayout.tsx` - Dashboard layout with sidebar
- `frontend/src/components/ProtectedRoute.tsx` - Auth route guard
- `frontend/src/components/AdminRoute.tsx` - Admin role guard
- `frontend/src/components/Navbar.tsx` - Navigation component
- `frontend/src/components/DashboardNav.tsx` - Dashboard sidebar
- `frontend/src/pages/HomePage.tsx`, `LoginPage.tsx`, `DashboardPage.tsx`, etc.
- `frontend/src/pages/admin/UsersListPage.tsx`, `UserCreatePage.tsx`, `UserEditPage.tsx`

Create placeholder for hooks:

```bash
mkdir -p frontend/src/hooks
touch frontend/src/hooks/.gitkeep
```

Go back to root:

```bash
cd ..
```

---

## 7. Infrastructure Setup

### 7.1 Create infrastructure/docker-compose.infra.yml

```yaml
services:
  postgres:
    image: postgres:18-alpine
    container_name: pg_db
    env_file:
      - ../.env
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    ports:
      - "${POSTGRES_PORT:-5432}:5432"
    volumes:
      - ../data/postgres:/var/lib/postgresql/data

  mongodb:
    image: mongo:8.2
    container_name: mongo_db
    env_file:
      - ../.env
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${MONGO_USER}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_PASSWORD}
    ports:
      - "${MONGO_PORT:-27017}:27017"
    volumes:
      - ../data/mongo:/data/db

  seaweedfs:
    image: chrislusf/seaweedfs:3.80
    container_name: seaweedfs
    env_file:
      - ../.env
    ports:
      - "${SEAWEEDFS_MASTER_PORT:-9333}:9333"
      - "8080:8080"
      - "${SEAWEEDFS_FILER_PORT:-8888}:8888"
      - "${SEAWEEDFS_S3_PORT:-8333}:8333"
    command: 'server -s3 -filer -volume.max=5 -master.volumeSizeLimitMB=1024'
    volumes:
      - ../data/seaweedfs:/data
```

---

## 8. Devcontainer Setup

### 8.1 Create .devcontainer/Dockerfile

```dockerfile
FROM mcr.microsoft.com/devcontainers/typescript-node:24-bookworm

# Install NestJS CLI globally
RUN npm install -g @nestjs/cli

# Oh My Zsh is installed via devcontainer feature (common-utils)
# See devcontainer.json for configuration

WORKDIR /workspace
```

### 8.2 Create .devcontainer/docker-compose.yml

```yaml
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    volumes:
      - ..:/workspace:cached
    command: sleep infinity
    env_file:
      - ../.env
    depends_on:
      - postgres
      - mongodb
      - seaweedfs
    networks:
      - devnetwork

  postgres:
    extends:
      file: ../infrastructure/docker-compose.infra.yml
      service: postgres
    networks:
      - devnetwork

  mongodb:
    extends:
      file: ../infrastructure/docker-compose.infra.yml
      service: mongodb
    networks:
      - devnetwork

  seaweedfs:
    extends:
      file: ../infrastructure/docker-compose.infra.yml
      service: seaweedfs
    networks:
      - devnetwork

networks:
  devnetwork:
    driver: bridge
```

### 8.3 Create .devcontainer/devcontainer.json

```json
{
  "name": "Full Stack Dev Container",
  "dockerComposeFile": "docker-compose.yml",
  "service": "app",
  "workspaceFolder": "/workspace",
  "customizations": {
    "vscode": {
      "settings": {
        "terminal.integrated.defaultProfile.linux": "zsh",
        "editor.formatOnSave": true,
        "editor.defaultFormatter": "esbenp.prettier-vscode",
        "tailwindCSS.experimental.classRegex": [
          ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*)\"['`]"]
        ]
      },
      "extensions": [
        "dbaeumer.vscode-eslint",
        "esbenp.prettier-vscode",
        "bradlc.vscode-tailwindcss",
        "firsttris.vscode-jest-runner",
        "dstopia.vitest-explorer",
        "mongodb.mongodb-vscode",
        "ckotzbauer.pgsql"
      ]
    }
  },
  "remoteUser": "node",
  "features": {
    "ghcr.io/devcontainers/features/common-utils:2": {
      "configureZshAsDefaultShell": true,
      "installOhMyZsh": true,
      "installOhMyZshConfig": true
    }
  },
  "onCreateCommand": ".devcontainer/scripts/on-create.sh",
  "postStartCommand": ".devcontainer/scripts/on-start.sh"
}
```

### 8.4 Create Devcontainer Scripts

Create the scripts directory:

```bash
mkdir -p .devcontainer/scripts
```

#### .devcontainer/scripts/on-create.sh

```bash
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
```

#### .devcontainer/scripts/on-start.sh

```bash
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
```

#### .devcontainer/scripts/wait-for-services.sh

```bash
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
```

#### .devcontainer/scripts/seed-admin.ts

```typescript
/**
 * Admin User Seeding Script
 *
 * This script seeds the admin user directly into PostgreSQL using bcrypt
 * from the backend package. It runs on every container start but is idempotent
 * (only creates admin if it doesn't exist).
 *
 * Environment Variables:
 * - ADMIN_EMAIL: Admin email (default: admin@example.com)
 * - ADMIN_PASSWORD: Admin password (default: admin123)
 * - ADMIN_NAME: Admin display name (default: Administrator)
 * - POSTGRES_*: Database connection settings
 */

import * as bcrypt from 'bcrypt';
import { Client } from 'pg';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

// ESM-compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from project root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Admin credentials from environment with defaults
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const ADMIN_NAME = process.env.ADMIN_NAME || 'Administrator';

// Bcrypt cost factor (must match backend/src/users/entities/user.entity.ts)
const BCRYPT_SALT_ROUNDS = 10;

async function seedAdmin(): Promise<void> {
  console.log('');
  console.log('========================================');
  console.log('  Admin User Seeding');
  console.log('========================================');

  const client = new Client({
    host: process.env.POSTGRES_HOST || 'postgres',
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
    user: process.env.POSTGRES_USER || 'user',
    password: process.env.POSTGRES_PASSWORD || 'password',
    database: process.env.POSTGRES_DB || 'app_db',
  });

  try {
    console.log('');
    console.log(`[1/4] Connecting to PostgreSQL...`);
    await client.connect();
    console.log('  Connected successfully!');

    // Check if users table exists (TypeORM creates it in dev mode)
    console.log('');
    console.log('[2/4] Checking if users table exists...');
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'users'
      );
    `);

    if (!tableCheck.rows[0]?.exists) {
      console.log('  Users table does not exist yet.');
      console.log('  The table will be created when the backend starts (TypeORM synchronize).');
      console.log('  Admin seeding skipped - will be handled by backend on first run.');
      return;
    }
    console.log('  Users table exists!');

    // Check if admin user already exists
    console.log('');
    console.log(`[3/4] Checking if admin exists (${ADMIN_EMAIL})...`);
    const existingAdmin = await client.query(
      'SELECT id, email FROM users WHERE email = $1',
      [ADMIN_EMAIL]
    );

    if (existingAdmin.rows.length > 0) {
      console.log(`  Admin user already exists: ${ADMIN_EMAIL}`);
      console.log('  Skipping creation.');
      return;
    }
    console.log('  Admin user not found. Creating...');

    // Hash password using bcrypt (same as backend entity)
    console.log('');
    console.log('[4/4] Creating admin user...');
    console.log(`  Hashing password with bcrypt (cost: ${BCRYPT_SALT_ROUNDS})...`);
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, BCRYPT_SALT_ROUNDS);

    // Insert admin user
    // Note: roles is stored as comma-separated string (TypeORM simple-array)
    await client.query(
      `
      INSERT INTO users (id, email, password, name, roles, "isActive", "createdAt", "updatedAt")
      VALUES (gen_random_uuid(), $1, $2, $3, $4, true, NOW(), NOW())
      `,
      [ADMIN_EMAIL, hashedPassword, ADMIN_NAME, 'admin,user']
    );

    console.log('');
    console.log('========================================');
    console.log('  Admin User Created Successfully!');
    console.log('========================================');
    console.log(`  Email:    ${ADMIN_EMAIL}`);
    console.log(`  Name:     ${ADMIN_NAME}`);
    console.log(`  Roles:    admin, user`);
    console.log(`  Password: (as configured in ADMIN_PASSWORD)`);
    console.log('');
  } catch (error) {
    console.error('');
    console.error('ERROR: Failed to seed admin user');
    console.error(error instanceof Error ? error.message : error);

    // Don't fail the container start if seeding fails
    // The backend will handle seeding on first run
    console.log('');
    console.log('Note: Admin seeding will be retried by backend on startup.');
    process.exit(0);
  } finally {
    await client.end();
  }
}

// Run the seeding
seedAdmin()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('Unexpected error:', error);
    process.exit(0); // Don't fail container start
  });
```

Make the shell scripts executable:

```bash
chmod +x .devcontainer/scripts/on-create.sh
chmod +x .devcontainer/scripts/on-start.sh
chmod +x .devcontainer/scripts/wait-for-services.sh
```

---

## 9. Final Configuration

### 9.1 Install All Dependencies

```bash
npm install
```

### 9.2 Initialize Husky

```bash
npx husky init
echo "npm run pre-commit" > .husky/pre-commit
```

### 9.3 Create Public Assets

Add favicon and icons to `frontend/public/`:

- `favicon.svg`
- `icons.svg`

Add images to `frontend/src/assets/`:

- `react.svg`
- `vite.svg`
- `hero.png` (optional)

---

## 10. Verification

### 10.1 Run Type Check

```bash
npm run typecheck
```

### 10.2 Run Linting

```bash
npm run lint
```

### 10.3 Run Tests

```bash
npm run test
```

### 10.4 Build Project

```bash
npm run build
```

### 10.5 Start Development Servers

```bash
# Start infrastructure first (requires Docker)
cd infrastructure
docker-compose -f docker-compose.infra.yml up -d
cd ..

# Start development servers
npm run dev
```

### 10.6 Full Verification

```bash
npm run verify
```

---

## Summary

You have now created a complete full-stack monorepo with:

- **Frontend**: React 19 + TypeScript 6 + Vite 8 + Tailwind CSS 4.2 + Zustand
- **Backend**: NestJS 11.1 + TypeScript 6 + TypeORM + Mongoose
- **Infrastructure**: PostgreSQL 18 + MongoDB 8.2 + SeaweedFS 3.80
- **DevOps**: Docker devcontainer + Husky + lint-staged + ESLint + Prettier

Key features implemented:

- JWT authentication with access/refresh tokens
- Role-based access control (RBAC)
- User management (CRUD)
- Audit logging (MongoDB)
- User data storage (PostgreSQL)
- Modern CSS-first Tailwind v4 configuration
- TypeScript 6 configuration optimized for TS7 compatibility
