# CODEBASE.md

This document provides a comprehensive listing of all files in the project with their purposes, key functions, and word counts for change tracking.

**Last Updated**: 2026-04-14
**Total Files**: 128 (excluding lock files)
**Total Words**: ~12,500 (source files only, excluding lock files)

## Quick Reference

| Section | Files | Words |
|---------|-------|-------|
| Root Configuration | 16 | ~1,700 |
| Git Hooks | 1 | 3 |
| Devcontainer | 8 | ~1,167 |
| Infrastructure | 1 | 67 |
| Shared Package | 5 | 221 |
| Backend | 48 | ~5,800 |
| Frontend | 50 | ~7,000 |

---

## File Index

| # | Path | Words | Purpose | Functions/Exports |
|---|------|-------|---------|-------------------|
| **Root Configuration** |||||
| 1 | `package.json` | 229 | Root monorepo configuration with npm workspaces | Defines workspaces (shared, frontend, backend), scripts for dev/build/test/lint |
| 2 | `package-lock.json` | 30942 | NPM dependency lock file | Locks exact versions of all dependencies |
| 3 | `.env` | 51 | Environment variables (gitignored) | Database credentials, JWT secrets, ports |
| 4 | `.env.example` | 91 | Environment variables template | Documents required environment variables |
| 5 | `.gitignore` | 320 | Git ignore patterns | Cross-platform (Windows, macOS, Linux/WSL), IDEs (VSCode, JetBrains, Vim), Node/TypeScript/NestJS/Vite/Vitest/Jest, Docker data |
| 6 | `.prettierrc.json` | 14 | Prettier formatting configuration | Single quotes, trailing commas, 100 char width, 2 space tabs |
| 7 | `.prettierignore` | 6 | Prettier ignore patterns | Excludes dist, coverage, node_modules, lock files |
| 8 | `.lintstagedrc.json` | 21 | Lint-staged configuration | Pre-commit: ESLint --fix + Prettier --write on staged .ts/.tsx files |
| 9 | `eslint.config.js` | 134 | ESLint flat config | TypeScript, React, NestJS linting rules |
| 10 | `LICENSE.txt` | 240 | Project license | MIT License terms |
| 11 | `README.md` | 6947 | Project README | Project overview, setup, **auth, authorization & resource-level access** |
| 12 | `CODEBASE.md` | 3124 | Codebase documentation | File index with word counts (this file) |
| 13 | `FROMSCRATCH.md` | 8533 | Recreation guide | Step-by-step guide to recreate project from scratch |
| 14 | `logs.txt` | 309 | Runtime logs | Application log output (gitignored in production) |
| 15 | `clean.sh` | 1264 | Clean script | Removes node_modules, dist, data, nested .git folders; cross-platform Docker/Podman cleanup (Linux, macOS, WSL); recreates data dirs with .gitkeep |
| **Git Hooks** |||||
| 16 | `.husky/pre-commit` | 3 | Husky pre-commit hook | Runs lint-staged: ESLint + Prettier on staged files (no tests - too slow) |
| **Devcontainer** |||||
| 17 | `.devcontainer/devcontainer.json` | 65 | VS Code devcontainer config | Container settings, VS Code extensions, features |
| 18 | `.devcontainer/Dockerfile` | 49 | Devcontainer Dockerfile | Node.js 24 LTS, NestJS CLI global install |
| 19 | `.devcontainer/docker-compose.yml` | 78 | Devcontainer Docker Compose | Orchestrates app container with infrastructure services |
| 20 | `.devcontainer/.env` | 51 | Devcontainer environment | Service hostnames (postgres, mongodb, seaweedfs), credentials |
| 21 | `.devcontainer/scripts/wait-for-services.sh` | 276 | Service health checker | Waits for PostgreSQL, MongoDB, SeaweedFS to be ready |
| 22 | `.devcontainer/scripts/on-create.sh` | 62 | Container creation hook | Runs once when container is created |
| 23 | `.devcontainer/scripts/on-start.sh` | 116 | Container startup hook | Waits for services, builds backend, seeds admin |
| 24 | `.devcontainer/scripts/seed-admin.ts` | 520 | Admin user seeding | Creates default admin user (admin@example.com/admin123) |
| **Infrastructure** |||||
| 25 | `infrastructure/docker-compose.infra.yml` | 67 | Infrastructure services | PostgreSQL 18, MongoDB 8.2, SeaweedFS 3.80 containers |
| **Shared Package** |||||
| 26 | `shared/package.json` | 32 | Shared types package config | Package metadata, exports configuration |
| 27 | `shared/types/index.ts` | 12 | Barrel export | Re-exports user, auth, and API types |
| 28 | `shared/types/user.types.ts` | 60 | User type definitions | `Role` enum, `UserDto`, `CreateUserRequest`, `UpdateUserRequest` |
| 29 | `shared/types/auth.types.ts` | 85 | Auth type definitions | `LoginRequest`, `LoginUser`, `LoginResponse`, `RefreshTokenRequest/Response`, `TokenPayload` |
| 30 | `shared/types/api.types.ts` | 45 | API type definitions | `ApiResponse<T>`, `PaginatedResponse<T>`, `PaginationQuery` |
| **Backend - Configuration** |||||
| 31 | `backend/package.json` | 210 | Backend package config | NestJS dependencies, scripts for build/test/start |
| 32 | `backend/package-lock.json` | 18680 | Backend dependency lock | Locks backend package versions |
| 33 | `backend/tsconfig.json` | 110 | Backend TypeScript config | ES2025 target, NodeNext module, decorators enabled |
| 34 | `backend/tsconfig.build.json` | 15 | Backend build config | Extends tsconfig, excludes test files |
| 35 | `backend/nest-cli.json` | 24 | NestJS CLI config | Build settings, sourceRoot, deleteOutDir, **HMR polling (usePolling: true, interval: 1000ms)** |
| 36 | `backend/README.md` | 406 | Backend README | Backend-specific setup and documentation |
| **Backend - Core Application** |||||
| 37 | `backend/src/main.ts` | 84 | Application entry point | `bootstrap()` - Creates app, CORS, validation pipes, /api prefix |
| 38 | `backend/src/app.module.ts` | 92 | Root module | Imports all feature modules (Auth, Users, Admin, AuditLog, Storage) |
| 39 | `backend/src/app.controller.ts` | 31 | Root controller | `getHello()` - GET / endpoint |
| 40 | `backend/src/app.service.ts` | 19 | Root service | `getHello()` - Returns "Hello World!" |
| 41 | `backend/src/app.controller.spec.ts` | 61 | Root controller tests | Unit tests for AppController |
| **Backend - Database** |||||
| 42 | `backend/src/database/database.module.ts` | 71 | PostgreSQL module | TypeORM async configuration with ConfigService |
| 43 | `backend/src/database/mongodb.module.ts` | 70 | MongoDB module | Mongoose async configuration with ConfigService |
| **Backend - Users Module** |||||
| 44 | `backend/src/users/users.module.ts` | 36 | Users module | Exports UsersService, imports User entity |
| 45 | `backend/src/users/users.service.ts` | 365 | Users service | `create()`, `findAll()`, `findById()`, `findByEmail()`, `update()`, `remove()`, `validatePassword()`, `seedDefaultAdmin()` |
| 46 | `backend/src/users/entities/user.entity.ts` | 167 | User entity | TypeORM entity with bcrypt hooks, `toSafeObject()`, `validatePassword()` |
| 47 | `backend/src/users/dto/create-user.dto.ts` | 58 | Create user DTO | Validation: email, password (min 8), name, roles?, isActive? |
| 48 | `backend/src/users/dto/update-user.dto.ts` | 61 | Update user DTO | Partial DTO with all optional fields |
| **Backend - Auth Module** |||||
| 49 | `backend/src/auth/auth.module.ts` | 126 | Auth module | Imports JwtModule, PassportModule; exports AuthService, TokenBlacklistService |
| 50 | `backend/src/auth/auth.service.ts` | 531 | Auth service | `login()`, `refreshTokens()`, `logout()`, `generateTokens()`, `validateUser()` |
| 51 | `backend/src/auth/auth.controller.ts` | 185 | Auth controller | POST /login, POST /refresh, POST /logout, GET /me |
| 52 | `backend/src/auth/token-blacklist.service.ts` | 166 | Token blacklist | `add()`, `isBlacklisted()`, `cleanup()`, `getCount()` - In-memory store |
| 53 | `backend/src/auth/dto/login.dto.ts` | 20 | Login DTO | Validation: email, password |
| 54 | `backend/src/auth/dto/refresh-token.dto.ts` | 14 | Refresh token DTO | Validation: refreshToken string |
| 55 | `backend/src/auth/strategies/jwt.strategy.ts` | 191 | JWT access strategy | Passport JWT, imports `TokenPayload` from shared |
| 56 | `backend/src/auth/strategies/jwt-refresh.strategy.ts` | 177 | JWT refresh strategy | Passport strategy, imports `TokenPayload` from shared |
| 57 | `backend/src/auth/guards/jwt-auth.guard.ts` | 100 | JWT auth guard | Protects routes, checks @Public() decorator |
| 58 | `backend/src/auth/guards/jwt-refresh.guard.ts` | 55 | JWT refresh guard | Protects refresh endpoint |
| 59 | `backend/src/auth/guards/roles.guard.ts` | 88 | Roles guard | `canActivate()` - Checks user roles against @Roles() |
| 60 | `backend/src/auth/decorators/current-user.decorator.ts` | 46 | Current user decorator | `@CurrentUser()` - Extracts user from request |
| 61 | `backend/src/auth/decorators/roles.decorator.ts` | 26 | Roles decorator | `@Roles()` - imports `Role` from shared |
| 62 | `backend/src/auth/decorators/public.decorator.ts` | 19 | Public decorator | `@Public()` - Marks routes as publicly accessible |
| **Backend - Admin Module** |||||
| 63 | `backend/src/admin/admin.module.ts` | 28 | Admin module | Admin-only user management, imports UsersModule |
| 64 | `backend/src/admin/admin.controller.ts` | 207 | Admin controller | GET/POST/PUT/DELETE /admin/users, activate, deactivate, updateRoles |
| **Backend - Audit Log Module** |||||
| 65 | `backend/src/audit-log/audit-log.module.ts` | 54 | Audit log module | MongoDB-based audit logging, exports AuditLogService |
| 66 | `backend/src/audit-log/audit-log.service.ts` | 321 | Audit log service | `create()`, `findAll()`, `findByUser()`, `findByResource()`, `countByAction()`, `log()` |
| 67 | `backend/src/audit-log/audit-log.controller.ts` | 216 | Audit log controller | GET /admin/audit-logs, /user/:userId, /resource/:resource, /stats/:action |
| 68 | `backend/src/audit-log/schemas/audit-log.schema.ts` | 132 | Audit log schema | Mongoose schema, `AuditAction` enum (CREATE, READ, UPDATE, DELETE, LOGIN, LOGOUT, LOGIN_FAILED) |
| **Backend - Storage Module** |||||
| 69 | `backend/src/storage/storage.module.ts` | 98 | Storage module | S3Client provider, Multer config, FileMetadata model |
| 70 | `backend/src/storage/storage.service.ts` | 842 | Storage service | `upload()`, `findById()`, `download()`, `getPresignedUrl()`, `findAll()`, `update()`, `delete()`, `findByUser()`, `ensureBucketExists()` |
| 71 | `backend/src/storage/storage.controller.ts` | 420 | Storage controller | POST /files/upload, GET /files, GET /files/:id, GET /:id/download, GET /:id/url, PATCH /:id, DELETE /:id |
| 72 | `backend/src/storage/config/s3.config.ts` | 76 | S3 client config | `createS3Client()`, S3_CLIENT token, DEFAULT_BUCKET constant |
| 73 | `backend/src/storage/schemas/file-metadata.schema.ts` | 177 | File metadata schema | Mongoose schema, `FileVisibility` enum (PUBLIC, PRIVATE) |
| 74 | `backend/src/storage/dto/upload-file.dto.ts` | 43 | Upload file DTO | Validation: description?, tags?, folder?, visibility? |
| 75 | `backend/src/storage/dto/update-file.dto.ts` | 43 | Update file DTO | Validation: description?, tags?, folder?, visibility? |
| 76 | `backend/src/storage/dto/file-query.dto.ts` | 75 | File query DTO | Validation: folder?, visibility?, tags?, search?, limit?, offset? |
| **Backend - Tests** |||||
| 77 | `backend/test/jest-e2e.json` | 17 | E2E test config | Jest configuration for E2E tests |
| 78 | `backend/test/app.e2e-spec.ts` | 76 | E2E test file | End-to-end tests for / endpoint |
| **Frontend - Configuration** |||||
| 79 | `frontend/package.json` | 108 | Frontend package config | React 19, Vite 8, Tailwind 4.2, Zustand dependencies |
| 80 | `frontend/package-lock.json` | 6423 | Frontend dependency lock | Locks frontend package versions |
| 81 | `frontend/tsconfig.json` | 25 | Frontend TypeScript config | Solution-style with references, path aliases |
| 82 | `frontend/tsconfig.app.json` | 89 | Frontend app TS config | ES2025 target, bundler moduleResolution, React JSX |
| 83 | `frontend/tsconfig.node.json` | 74 | Frontend node TS config | Config for vite.config.ts |
| 84 | `frontend/vite.config.ts` | 73 | Vite configuration | React plugin, Tailwind plugin, @ alias, Vitest config, **HMR polling (usePolling: true, interval: 1000ms)** |
| 85 | `frontend/components.json` | 36 | shadcn/ui config | New York style, neutral base color, path aliases |
| 86 | `frontend/index.html` | 32 | HTML entry point | Root HTML with div#root, loads /src/main.tsx |
| 87 | `frontend/.gitignore` | 27 | Frontend git ignore | Frontend-specific ignores (dist, local env) |
| 88 | `frontend/README.md` | 212 | Frontend README | Frontend setup and development guide |
| **Frontend - Assets** |||||
| 89 | `frontend/public/ceralume_logo.png` | - | Ceralume Labs logo | Company logo displayed in header/footer (35KB) |
| 90 | `frontend/src/assets/hero.png` | - | Hero image | PNG 343x361, 44KB (binary) |
| 91 | `frontend/src/assets/react.svg` | 366 | React logo | React logo SVG |
| 92 | `frontend/src/assets/vite.svg` | 439 | Vite logo | Vite logo SVG |
| **Frontend - Core** |||||
| 92 | `frontend/src/main.tsx` | 65 | DOM entry point | Renders App component in StrictMode |
| 93 | `frontend/src/App.tsx` | 382 | App root component | Auth initialization, loading state, RouterProvider |
| 94 | `frontend/src/index.css` | 434 | Global styles | Tailwind v4 imports, CSS variables, theme config |
| **Frontend - Routes** |||||
| 95 | `frontend/src/routes/index.tsx` | 199 | Router configuration | Routes: /, /about, /login, /dashboard, /dashboard/admin/* |
| **Frontend - Layouts** |||||
| 96 | `frontend/src/layouts/RootLayout.tsx` | 42 | Public layout | Wraps public pages with Navbar and Footer |
| 97 | `frontend/src/layouts/DashboardLayout.tsx` | 84 | Dashboard layout | Wraps authenticated pages with DashboardNav |
| **Frontend - Pages** |||||
| 98 | `frontend/src/pages/HomePage.tsx` | 117 | Home page | Landing page with hero, features |
| 99 | `frontend/src/pages/AboutPage.tsx` | 83 | About page | Project info, tech stack list |
| 100 | `frontend/src/pages/LoginPage.tsx` | 326 | Login page | Uses shadcn/ui: Card, Button, Input, Label, Alert |
| 101 | `frontend/src/pages/DashboardPage.tsx` | 306 | Dashboard page | Stats cards, admin quick actions |
| 102 | `frontend/src/pages/NotFoundPage.tsx` | 48 | 404 page | Not found error with home link |
| 103 | `frontend/src/pages/admin/UsersListPage.tsx` | 565 | Users list page | Table with edit/delete/activate actions |
| 104 | `frontend/src/pages/admin/UserCreatePage.tsx` | 119 | Create user page | Form to create new user |
| 105 | `frontend/src/pages/admin/UserEditPage.tsx` | 268 | Edit user page | Form to edit existing user |
| **Frontend - Components** |||||
| 106 | `frontend/src/components/Navbar.tsx` | 148 | Public navbar | Ceralume logo, Home, About, Sign in/Dashboard links |
| 107 | `frontend/src/components/Footer.tsx` | 53 | Footer | Ceralume logo + copyright notice |
| 108 | `frontend/src/components/ProtectedRoute.tsx` | 52 | Auth route guard | Redirects unauthenticated to /login |
| 109 | `frontend/src/components/AdminRoute.tsx` | 62 | Admin route guard | Redirects non-admin to /dashboard |
| 110 | `frontend/src/components/DashboardNav.tsx` | 529 | Dashboard navbar | Ceralume logo, profile dropdown, mobile menu, logout |
| 111 | `frontend/src/components/admin/UserForm.tsx` | 461 | User form | Uses shadcn/ui: Button, Input, Label, Checkbox, Badge, Alert |
| **Frontend - shadcn/ui Components** |||||
| 112 | `frontend/src/components/ui/button.tsx` | 169 | Button | Variants: default, destructive, outline, secondary, ghost, link |
| 113 | `frontend/src/components/ui/input.tsx` | 69 | Input | Styled input with focus ring |
| 114 | `frontend/src/components/ui/label.tsx` | 68 | Label | Accessible form label (Radix UI) |
| 115 | `frontend/src/components/ui/card.tsx` | 176 | Card | Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter |
| 116 | `frontend/src/components/ui/checkbox.tsx` | 81 | Checkbox | Radix UI checkbox with check icon |
| 117 | `frontend/src/components/ui/badge.tsx` | 102 | Badge | Variants: default, secondary, destructive, outline |
| 118 | `frontend/src/components/ui/alert.tsx` | 145 | Alert | Alert, AlertTitle, AlertDescription; variants: default, destructive |
| **Frontend - Hooks** |||||
| 119 | `frontend/src/hooks/.gitkeep` | 0 | Placeholder | Directory for custom React hooks |
| **Frontend - Libraries** |||||
| 120 | `frontend/src/lib/utils.ts` | 22 | Utility functions | `cn()` - Tailwind class merger (clsx + tailwind-merge) |
| 121 | `frontend/src/lib/api.ts` | 200 | API client | `ApiClient` class: get/post/put/delete, token management |
| **Frontend - Services** |||||
| 122 | `frontend/src/services/auth.service.ts` | 108 | Auth service | Imports types from `@pcfs-demo/shared`, re-exports for convenience |
| 123 | `frontend/src/services/users.service.ts` | 122 | Users service | Imports `UserDto`, `CreateUserRequest`, `UpdateUserRequest` from shared |
| **Frontend - Stores** |||||
| 124 | `frontend/src/stores/authStore.ts` | 307 | Auth store | Imports `LoginUser` from shared, Zustand persisted state |
| **Frontend - Tests** |||||
| 125 | `frontend/src/test/setup.ts` | 2 | Test setup | Imports @testing-library/jest-dom |
| 126 | `frontend/src/pages/HomePage.test.tsx` | 98 | HomePage tests | Unit tests for HomePage component |
| 127 | `frontend/src/components/Navbar.test.tsx` | 97 | Navbar tests | Unit tests for Navbar component |

---

## API Endpoints Reference

### Auth (`/api/auth`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/login` | Public | Login with email/password, returns tokens + user |
| POST | `/refresh` | Refresh Token | Exchange refresh token for new token pair |
| POST | `/logout` | JWT | Invalidate tokens (blacklist) |
| GET | `/me` | JWT | Get current user profile |

### Admin Users (`/api/admin/users`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | Admin | List all users |
| GET | `/:id` | Admin | Get user by ID |
| POST | `/` | Admin | Create new user |
| PUT | `/:id` | Admin | Update user |
| DELETE | `/:id` | Admin | Delete user |
| POST | `/:id/activate` | Admin | Activate user |
| POST | `/:id/deactivate` | Admin | Deactivate user |
| PUT | `/:id/roles` | Admin | Update user roles |

### Admin Audit Logs (`/api/admin/audit-logs`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | Admin | Query audit logs with filters |
| GET | `/user/:userId` | Admin | Get logs by user |
| GET | `/resource/:resource` | Admin | Get logs by resource |
| GET | `/stats/:action` | Admin | Get action statistics |

### Files (`/api/files`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/upload` | JWT | Upload file to SeaweedFS |
| GET | `/` | JWT | List files (with filters) |
| GET | `/public` | Public | List public files |
| GET | `/user/my-files` | JWT | List current user's files |
| GET | `/:id` | JWT | Get file metadata |
| GET | `/:id/download` | JWT/Public | Download file |
| GET | `/:id/url` | JWT | Get presigned URL |
| PATCH | `/:id` | JWT | Update file metadata |
| DELETE | `/:id` | JWT | Delete file |

---

## Default Credentials

| Type | Email | Password |
|------|-------|----------|
| Admin | `admin@example.com` | `admin123` |

---

## Environment Variables

```bash
# Application
NODE_ENV=development
PORT=3000
CORS_ORIGIN=http://localhost:5173

# Frontend
VITE_API_URL=http://localhost:3000/api

# JWT Authentication
JWT_SECRET=<secret>
JWT_REFRESH_SECRET=<secret>
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

# SeaweedFS
SEAWEEDFS_HOST=seaweedfs
SEAWEEDFS_MASTER_PORT=9333
SEAWEEDFS_S3_PORT=8333
SEAWEEDFS_FILER_PORT=8888
```

---

## Directory Structure

```
Demo/
├── .devcontainer/          # VS Code devcontainer (8 files)
│   ├── scripts/            # Startup and seeding scripts
│   ├── .env                # Container environment
│   ├── devcontainer.json
│   ├── docker-compose.yml
│   └── Dockerfile
├── .husky/                 # Git hooks (1 file)
├── backend/                # NestJS API (49 files)
│   ├── src/
│   │   ├── admin/          # Admin user management
│   │   ├── audit-log/      # MongoDB audit logging
│   │   ├── auth/           # JWT authentication
│   │   │   ├── decorators/
│   │   │   ├── dto/
│   │   │   ├── guards/
│   │   │   └── strategies/
│   │   ├── common/enums/   # Shared enums
│   │   ├── database/       # TypeORM & Mongoose config
│   │   ├── storage/        # SeaweedFS S3 storage
│   │   │   ├── config/
│   │   │   ├── dto/
│   │   │   └── schemas/
│   │   └── users/          # User entity & service
│   │       ├── dto/
│   │       └── entities/
│   └── test/               # E2E tests
├── frontend/               # React SPA (38 files)
│   ├── public/             # Static assets (empty)
│   └── src/
│       ├── assets/         # Images (hero.png, logos)
│       ├── components/     # React components
│       │   ├── admin/      # Admin-specific
│       │   └── ui/         # shadcn/ui (placeholder)
│       ├── hooks/          # Custom hooks (placeholder)
│       ├── layouts/        # Page layouts
│       ├── lib/            # Utilities & API client
│       ├── pages/          # Page components
│       │   └── admin/      # Admin pages
│       ├── routes/         # React Router config
│       ├── services/       # API service functions
│       ├── stores/         # Zustand stores
│       └── test/           # Test setup & tests
├── infrastructure/         # Docker services (1 file)
├── shared/                 # Shared types (5 files)
│   └── types/
└── data/                   # Docker volumes (gitignored)
    ├── postgres/
    ├── mongodb/
    └── seaweedfs/
```

---

## Summary

- **Total Source Files**: 128
- **Backend Files**: 48 (40 source + 8 config)
- **Frontend Files**: 50 (40 source + 10 config, includes 7 shadcn/ui components)
- **Shared Files**: 5
- **Devcontainer Files**: 8
- **Infrastructure Files**: 1
- **Root Config Files**: 15
- **Git Hooks**: 1

### Notes
- **Docker HMR Polling**: Both frontend (`vite.config.ts`) and backend (`nest-cli.json`) are configured with file system polling (`usePolling: true`, `interval: 1000ms`) for Hot Module Replacement in Docker Linux containers where inotify events don't propagate from host to container
- `frontend/public/` contains Ceralume Labs logo (ceralume_logo.png)
- `frontend/src/components/ui/` contains 7 shadcn/ui components (button, input, label, card, checkbox, badge, alert)
- `frontend/components.json` includes `_installedComponents` registry for tracking shadcn/ui components
- `frontend/src/hooks/` contains only .gitkeep (custom hooks not yet added)
- `data/` directory is created at runtime by Docker volumes
- `logs.txt` is a runtime artifact
