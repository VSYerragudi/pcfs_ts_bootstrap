# Full-Stack Demo Project

A modern full-stack monorepo demonstrating best practices for building web applications with React and NestJS.

## Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| **Frontend** | React | 19 |
| | TypeScript | 6 |
| | Vite | 8 |
| | React Router | 7 |
| | Tailwind CSS | 4.2 |
| | shadcn/ui | latest |
| | Zustand | 5 |
| | Vitest | 4 |
| **Backend** | NestJS | 11 |
| | TypeScript | 6 |
| | Jest | 30 |
| **Database** | PostgreSQL | 18 |
| | MongoDB | 8.2 |
| **Storage** | SeaweedFS | 3.80 |
| **Runtime** | Node.js | 24 LTS |

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (for devcontainer)
- [VS Code](https://code.visualstudio.com/) with [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

**Or** for local development without Docker:
- Node.js 24 LTS
- npm 10+
- PostgreSQL 18
- MongoDB 8.2

## Getting Started

### Option 1: Using Dev Container (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Demo
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` if you need to change default values.

3. **Copy .env for devcontainer**
   ```bash
   cp .env .devcontainer/.env
   ```
   This copy is required for Docker Compose to read environment variables during container build.

   > **Note:** If you update the root `.env` file, remember to copy it to `.devcontainer/.env` again.

4. **Open in VS Code**
   ```bash
   code .
   ```

5. **Start Dev Container**
   - Press `F1` and select `Dev Containers: Reopen in Container`
   - Wait for the container to build (first time takes a few minutes)

6. **Install dependencies**
   ```bash
   npm install
   ```

7. **Start development servers**
   ```bash
   npm run dev
   ```

8. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

### Option 2: Local Development

1. **Clone and set up environment**
   ```bash
   git clone <repository-url>
   cd Demo
   cp .env.example .env
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start infrastructure services**
   ```bash
   docker compose -f infrastructure/docker-compose.infra.yml up -d
   ```

4. **Start development servers**
   ```bash
   npm run dev
   ```

## Project Structure

```
Demo/
├── frontend/                # React application
│   ├── src/
│   │   ├── main.tsx        # Application entry point
│   │   ├── index.css       # Tailwind CSS & theme variables
│   │   ├── routes/         # React Router configuration
│   │   ├── pages/          # Page components
│   │   ├── layouts/        # Layout components
│   │   ├── components/     # Shared components
│   │   │   └── ui/         # shadcn/ui components
│   │   ├── lib/utils.ts    # Utility functions (cn helper)
│   │   ├── hooks/          # Custom React hooks
│   │   └── assets/         # Static assets
│   ├── public/             # Public static files
│   ├── components.json     # shadcn/ui configuration
│   ├── package.json
│   ├── vite.config.ts      # Vite configuration
│   └── tsconfig.json       # TypeScript configuration
│
├── backend/                 # NestJS application
│   ├── src/
│   │   ├── main.ts         # Application bootstrap
│   │   ├── app.module.ts   # Root module
│   │   ├── app.controller.ts
│   │   └── app.service.ts
│   ├── test/               # E2E tests
│   ├── package.json
│   └── tsconfig.json
│
├── infrastructure/          # Docker services
│   └── docker-compose.infra.yml
│
├── .devcontainer/          # VS Code dev container
│   ├── devcontainer.json
│   ├── docker-compose.yml
│   └── Dockerfile
│
├── .husky/                 # Git hooks
│   └── pre-commit
│
├── .env.example            # Environment variables template
├── .gitignore              # Git ignore rules
├── eslint.config.js        # ESLint configuration (monorepo)
├── .prettierrc.json        # Prettier configuration
├── .lintstagedrc.json      # Lint-staged configuration
└── package.json            # Root package with workspaces
```

## Available Commands

All commands are run from the root directory.

### Development

```bash
# Start both frontend and backend in development mode
npm run dev

# Start only frontend (Vite dev server)
npm run dev:frontend

# Start only backend (NestJS watch mode)
npm run dev:backend
```

### Testing

```bash
# Run all tests
npm run test

# Run frontend tests only
npm run test:frontend

# Run backend tests only
npm run test:backend

# Run backend E2E tests
npm run test:e2e

# Run tests with coverage
npm run test:coverage
```

### Type Checking

```bash
# Type check entire project
npm run typecheck

# Type check frontend only
npm run typecheck:frontend

# Type check backend only
npm run typecheck:backend
```

### Building

```bash
# Build both frontend and backend
npm run build

# Build frontend only (outputs to frontend/dist)
npm run build:frontend

# Build backend only (outputs to backend/dist)
npm run build:backend
```

### Code Quality

```bash
# Run ESLint
npm run lint

# Run ESLint with auto-fix
npm run lint:fix

# Format code with Prettier
npm run format

# Check formatting
npm run format:check
```

### Utilities

```bash
# Install all dependencies (root + frontend + backend)
npm run install:all

# Clean everything (node_modules + dist + coverage)
npm run clean

# Clean only build outputs
npm run clean:dist

# Clean and reinstall all dependencies
npm run reinstall

# Full verification (typecheck + lint + test + build)
npm run verify

# Start backend in production mode
npm run start:prod
```

## Development Workflow

### 1. Making Changes

1. Create a new branch for your feature
   ```bash
   git checkout -b feature/my-feature
   ```

2. Start the development servers
   ```bash
   npm run dev
   ```

3. Make your changes - the servers will hot-reload automatically

### 2. Before Committing

The pre-commit hook automatically runs ESLint and Prettier on staged files.

For a full verification before pushing:
```bash
npm run verify
```

### 3. Code Style

This project enforces consistent code style:

- **ESLint** - Catches errors and enforces best practices
- **Prettier** - Formats code automatically
- **TypeScript** - Strict type checking enabled

Configuration files:
- `eslint.config.js` - ESLint rules for the entire monorepo
- `.prettierrc.json` - Prettier formatting options

## UI & Styling

This project uses **Tailwind CSS v4** with **shadcn/ui** components.

### Tailwind CSS v4 Theme

Tailwind v4 uses a CSS-first configuration. All theme customization is done in `frontend/src/index.css`.

#### Editing Theme Colors

Colors use the OKLCH color space for better perceptual uniformity:

```css
/* frontend/src/index.css */
:root {
  /* Primary brand color */
  --primary: oklch(20.47% 0.006 285.88);
  --primary-foreground: oklch(98.51% 0.001 285.94);

  /* Accent color */
  --accent: oklch(96.76% 0.001 285.94);
  --accent-foreground: oklch(20.47% 0.006 285.88);

  /* Add more custom colors... */
}

.dark {
  /* Dark mode overrides */
  --primary: oklch(98.51% 0.001 285.94);
  --primary-foreground: oklch(20.47% 0.006 285.88);
}
```

#### Adding Custom Theme Values

Extend the theme using `@theme inline`:

```css
@theme inline {
  /* Map CSS variables to Tailwind utilities */
  --color-brand: var(--brand);
  --color-brand-foreground: var(--brand-foreground);

  /* Custom spacing */
  --spacing-18: 4.5rem;

  /* Custom fonts */
  --font-heading: 'Inter', sans-serif;
}
```

Then use in your components: `bg-brand`, `text-brand-foreground`, `p-18`, `font-heading`.

#### OKLCH Color Reference

OKLCH format: `oklch(lightness% chroma hue)`
- **Lightness**: 0% (black) to 100% (white)
- **Chroma**: 0 (gray) to ~0.4 (vivid)
- **Hue**: 0-360 (red=30, orange=70, yellow=110, green=150, cyan=190, blue=260, purple=300, pink=350)

Tools: [OKLCH Color Picker](https://oklch.com/)

### shadcn/ui Components

shadcn/ui provides beautifully designed, accessible components that you copy into your project.

#### Adding Components

```bash
# Add individual components
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add dialog

# Add multiple components at once
npx shadcn@latest add button card input label

# View all available components
npx shadcn@latest add
```

Components are installed to `frontend/src/components/ui/`.

#### Using Components

```tsx
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome</CardTitle>
      </CardHeader>
      <CardContent>
        <Button variant="default">Click me</Button>
        <Button variant="outline">Secondary</Button>
        <Button variant="destructive">Delete</Button>
      </CardContent>
    </Card>
  );
}
```

#### Component Customization

Components are copied to your project, so you can modify them directly:

```tsx
// frontend/src/components/ui/button.tsx
// Edit variants, sizes, styles as needed
```

#### Class Merging with cn()

Use the `cn()` utility for conditional classes:

```tsx
import { cn } from '@/lib/utils';

<div className={cn(
  'base-styles',
  isActive && 'active-styles',
  className
)} />
```

#### Directory Structure

```
frontend/src/
├── components/
│   └── ui/           # shadcn/ui components (auto-generated)
│       ├── button.tsx
│       ├── card.tsx
│       └── ...
├── lib/
│   └── utils.ts      # cn() helper function
└── hooks/            # Custom React hooks
```

#### Configuration

shadcn/ui settings are in `frontend/components.json`:
- **style**: `new-york` (modern design)
- **baseColor**: `neutral` (gray scale)
- **cssVariables**: `true` (uses CSS custom properties)
- **iconLibrary**: `lucide` (Lucide React icons)

For more components and examples, visit [ui.shadcn.com](https://ui.shadcn.com/).

### Routing with React Router

This project uses React Router v7 for client-side navigation.

#### Project Structure

```
frontend/src/
├── routes/
│   └── index.tsx         # Router configuration
├── pages/
│   ├── HomePage.tsx      # Home page (/)
│   ├── AboutPage.tsx     # About page (/about)
│   └── NotFoundPage.tsx  # 404 page
├── layouts/
│   └── RootLayout.tsx    # Main layout with navbar
└── components/
    └── Navbar.tsx        # Navigation component
```

#### Adding New Routes

1. Create a new page component in `frontend/src/pages/`:

```tsx
// frontend/src/pages/ContactPage.tsx
export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold">Contact Us</h1>
      {/* Page content */}
    </div>
  );
}
```

2. Add the route in `frontend/src/routes/index.tsx`:

```tsx
import ContactPage from '@/pages/ContactPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      // ... existing routes
      {
        path: 'contact',
        element: <ContactPage />,
      },
    ],
  },
]);
```

3. Add navigation link in `frontend/src/components/Navbar.tsx`:

```tsx
<NavLink to="/contact" className={({ isActive }) => cn(...)}>
  Contact
</NavLink>
```

#### Navigation Components

Use React Router's components for navigation:

```tsx
import { Link, NavLink, useNavigate } from 'react-router-dom';

// Basic link
<Link to="/about">About</Link>

// NavLink with active state styling
<NavLink
  to="/about"
  className={({ isActive }) =>
    cn('text-sm', isActive ? 'text-primary' : 'text-muted-foreground')
  }
>
  About
</NavLink>

// Programmatic navigation
const navigate = useNavigate();
navigate('/about');
navigate(-1); // Go back
```

#### Using shadcn/ui with React Router

To create dropdown menus with navigation:

```bash
# Install dropdown menu component
npx shadcn@latest add dropdown-menu button
```

```tsx
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

export function NavMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link to="/">Home</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/about">About</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/contact">Contact</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

For complex navigation menus:

```bash
# Install navigation menu component
npx shadcn@latest add navigation-menu
```

```tsx
import { Link } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

export function MainNav() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link to="/">Home</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Products</NavigationMenuTrigger>
          <NavigationMenuContent>
            <NavigationMenuLink asChild>
              <Link to="/products/electronics">Electronics</Link>
            </NavigationMenuLink>
            <NavigationMenuLink asChild>
              <Link to="/products/clothing">Clothing</Link>
            </NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
```

#### Route Parameters and Loaders

```tsx
// Dynamic route with parameters
{
  path: 'users/:userId',
  element: <UserPage />,
}

// Access params in component
import { useParams } from 'react-router-dom';

function UserPage() {
  const { userId } = useParams();
  return <div>User ID: {userId}</div>;
}
```

For more details, see [React Router Documentation](https://reactrouter.com/).

## Service Ports

| Service | Port | Description |
|---------|------|-------------|
| Frontend (Vite) | 5173 | React development server |
| Backend (NestJS) | 3000 | REST API server |
| PostgreSQL | 5432 | Relational database |
| MongoDB | 27017 | Document database |
| SeaweedFS Master | 9333 | Distributed storage master |
| SeaweedFS S3 | 8333 | S3-compatible API |

## Environment Configuration

All environment variables are defined in a single `.env` file at the project root.

1. Copy the example file:
   ```bash
   cp .env.example .env
   ```

2. Available variables (see `.env.example` for full list):

   | Variable | Default | Description |
   |----------|---------|-------------|
   | `NODE_ENV` | development | Environment mode |
   | `PORT` | 3000 | Backend server port |
   | `VITE_API_URL` | http://localhost:3000 | API URL for frontend |
   | `POSTGRES_*` | - | PostgreSQL connection settings |
   | `MONGO_*` | - | MongoDB connection settings |
   | `SEAWEEDFS_*` | - | SeaweedFS connection settings |

> **Note:** Never commit `.env` to version control. It's already in `.gitignore`.

## Database Connections

Connection details are configured via environment variables in `.env`.

### PostgreSQL
```
Host: localhost (or $POSTGRES_HOST in devcontainer)
Port: $POSTGRES_PORT (default: 5432)
Database: $POSTGRES_DB (default: app_db)
Username: $POSTGRES_USER (default: user)
Password: $POSTGRES_PASSWORD
```

### MongoDB
```
Host: localhost (or $MONGO_HOST in devcontainer)
Port: $MONGO_PORT (default: 27017)
Username: $MONGO_USER (default: admin)
Password: $MONGO_PASSWORD
```

## Authentication Architecture

This project implements JWT-based authentication with a **manual credential validation** approach rather than using `passport-local`. This section explains the architecture and the reasoning behind this design decision.

### Why No passport-local Strategy?

You might notice there's no `passport-local` strategy in this codebase. This is an **intentional design choice**, not an oversight.

#### Traditional Passport Approach
```
┌─────────────┐    ┌──────────────────┐    ┌─────────────┐    ┌─────────────┐
│   Request   │───▶│ passport-local   │───▶│ Validate    │───▶│ Issue JWT   │
│  (email/pw) │    │ Strategy         │    │ Credentials │    │ Tokens      │
└─────────────┘    └──────────────────┘    └─────────────┘    └─────────────┘
```

#### Our Approach (Manual Validation)
```
┌─────────────┐    ┌──────────────────┐    ┌─────────────┐
│   Request   │───▶│ AuthService      │───▶│ Issue JWT   │
│  (email/pw) │    │ .login()         │    │ Tokens      │
└─────────────┘    │ (validates here) │    └─────────────┘
                   └──────────────────┘
```

#### When to Use Each Approach

| Approach | Best For |
|----------|----------|
| **Manual validation (this project)** | Simple email/password, JWT-only APIs, no sessions |
| **passport-local** | Multiple auth methods (OAuth, SAML), session-based auth, complex auth flows |

#### Benefits of Manual Validation

1. **Simpler code** - No Passport boilerplate for a single auth method
2. **Fewer dependencies** - No need for `passport-local` package
3. **Full control** - Custom validation logic, better error messages
4. **Easier audit logging** - Log at each step of validation
5. **Clearer flow** - Students can trace the entire auth flow in one file

### How Login Works

The login endpoint (`POST /api/auth/login`) is **not protected** by any guard - it's a public endpoint that validates credentials manually.

#### Login Flow (auth.service.ts)

```
POST /api/auth/login
        │
        ▼
┌───────────────────────────────────────────────────────────────┐
│                    AuthService.login()                         │
├───────────────────────────────────────────────────────────────┤
│                                                                │
│  1. Find user by email                                         │
│     └─▶ usersService.findByEmail(email)                       │
│         └─▶ Returns User entity or null                       │
│                                                                │
│  2. Check user exists                                          │
│     └─▶ If null → log failure → throw 401 "Invalid credentials"│
│                                                                │
│  3. Check user is active                                       │
│     └─▶ If !isActive → log failure → throw 401 "Account deactivated"│
│                                                                │
│  4. Validate password                                          │
│     └─▶ usersService.validatePassword(user, password)         │
│         └─▶ bcrypt.compare(password, user.password)           │
│         └─▶ If false → log failure → throw 401 "Invalid credentials"│
│                                                                │
│  5. Generate tokens                                            │
│     └─▶ generateTokens(userId, email, roles)                  │
│         └─▶ jwtService.signAsync(accessPayload, { expiresIn: '15m' })│
│         └─▶ jwtService.signAsync(refreshPayload, { secret, expiresIn: '7d' })│
│                                                                │
│  6. Log successful login                                       │
│     └─▶ auditLogService.log(userId, email, LOGIN, 'auth')     │
│                                                                │
│  7. Return response                                            │
│     └─▶ { accessToken, refreshToken, user: { id, email, name, roles } }│
│                                                                │
└───────────────────────────────────────────────────────────────┘
```

#### Code Walkthrough

```typescript
// auth.service.ts - login() method

async login(loginDto: LoginDto, context?: RequestContext): Promise<AuthResponse> {
  // Step 1: Find user
  const user = await this.usersService.findByEmail(loginDto.email);

  // Step 2: User exists?
  if (!user) {
    await this.auditLogService.log('unknown', loginDto.email, AuditAction.LOGIN_FAILED, ...);
    throw new UnauthorizedException('Invalid credentials');
  }

  // Step 3: User active?
  if (!user.isActive) {
    await this.auditLogService.log(user.id, user.email, AuditAction.LOGIN_FAILED, ...);
    throw new UnauthorizedException('Account is deactivated');
  }

  // Step 4: Password valid?
  const isPasswordValid = await this.usersService.validatePassword(user, loginDto.password);
  if (!isPasswordValid) {
    await this.auditLogService.log(user.id, user.email, AuditAction.LOGIN_FAILED, ...);
    throw new UnauthorizedException('Invalid credentials');
  }

  // Step 5: Generate tokens
  const tokens = await this.generateTokens(user.id, user.email, user.roles);

  // Step 6: Log success
  await this.auditLogService.log(user.id, user.email, AuditAction.LOGIN, 'auth', ...);

  // Step 7: Return
  return { ...tokens, user: { id, email, name, roles } };
}
```

### Token Generation

Tokens are created using `@nestjs/jwt`'s `JwtService.signAsync()`:

```typescript
// auth.service.ts - generateTokens() method

private async generateTokens(userId: string, email: string, roles: string[]): Promise<TokenPair> {
  // Access token payload
  const accessPayload: JwtPayload = {
    sub: userId,      // Subject (user ID)
    email,
    roles,
    type: 'access',   // Token type identifier
  };

  // Refresh token payload (same structure)
  const refreshPayload: JwtPayload = {
    sub: userId,
    email,
    roles,
    type: 'refresh',
  };

  // Sign both tokens in parallel
  const [accessToken, refreshToken] = await Promise.all([
    this.jwtService.signAsync(accessPayload, {
      expiresIn: '15m',  // Short-lived access token
    }),
    this.jwtService.signAsync(refreshPayload, {
      secret: this.refreshSecret,  // Different secret for refresh tokens!
      expiresIn: '7d',             // Long-lived refresh token
    }),
  ]);

  return { accessToken, refreshToken };
}
```

#### Token Structure

| Field | Access Token | Refresh Token |
|-------|-------------|---------------|
| `sub` | User ID | User ID |
| `email` | User email | User email |
| `roles` | User roles | User roles |
| `type` | `"access"` | `"refresh"` |
| `exp` | 15 minutes | 7 days |
| `secret` | JWT_SECRET | JWT_REFRESH_SECRET |

### Where Passport IS Used

Passport strategies are used **only for validating existing tokens**, not for initial authentication:

| Strategy | File | Purpose |
|----------|------|---------|
| `jwt` | `jwt.strategy.ts` | Validates access tokens on protected routes |
| `jwt-refresh` | `jwt-refresh.strategy.ts` | Validates refresh tokens for token renewal |

#### JWT Strategy (for Protected Routes)

```typescript
// jwt.strategy.ts

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(...) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),  // Bearer token from header
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    // Check token isn't blacklisted
    if (token && this.tokenBlacklistService.isBlacklisted(token)) {
      throw new UnauthorizedException('Token has been revoked');
    }

    // Only accept access tokens (not refresh tokens)
    if (payload.type !== 'access') {
      throw new UnauthorizedException('Invalid token type');
    }

    // Verify user still exists and is active
    const user = await this.usersService.findById(payload.sub);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found or inactive');
    }

    // Return user info for @CurrentUser() decorator
    return { userId: payload.sub, email: payload.email, roles: payload.roles };
  }
}
```

### Complete Authentication Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           AUTHENTICATION FLOW                                │
└─────────────────────────────────────────────────────────────────────────────┘

1. LOGIN (No Passport)
   ════════════════════
   Client                           Server
     │                                │
     │  POST /api/auth/login          │
     │  { email, password }           │
     │ ─────────────────────────────▶ │
     │                                │  AuthController.login()
     │                                │       │
     │                                │       ▼
     │                                │  AuthService.login()
     │                                │       │
     │                                │       ├─▶ Find user by email
     │                                │       ├─▶ Check user active
     │                                │       ├─▶ bcrypt.compare(password)
     │                                │       ├─▶ Generate JWT tokens
     │                                │       └─▶ Log to audit
     │                                │
     │  { accessToken, refreshToken,  │
     │    user: {...} }               │
     │ ◀───────────────────────────── │


2. PROTECTED REQUEST (Uses Passport JWT)
   ══════════════════════════════════════
   Client                           Server
     │                                │
     │  GET /api/admin/users          │
     │  Authorization: Bearer <token> │
     │ ─────────────────────────────▶ │
     │                                │  JwtAuthGuard
     │                                │       │
     │                                │       ▼
     │                                │  JwtStrategy.validate()
     │                                │       │
     │                                │       ├─▶ Verify signature
     │                                │       ├─▶ Check not expired
     │                                │       ├─▶ Check not blacklisted
     │                                │       ├─▶ Check type === 'access'
     │                                │       └─▶ Verify user active
     │                                │
     │                                │  RolesGuard
     │                                │       │
     │                                │       └─▶ Check user.roles includes 'admin'
     │                                │
     │                                │  AdminController.findAll()
     │  { users: [...] }              │
     │ ◀───────────────────────────── │


3. TOKEN REFRESH (Uses Passport JWT-Refresh)
   ══════════════════════════════════════════
   Client                           Server
     │                                │
     │  POST /api/auth/refresh        │
     │  { refreshToken }              │
     │ ─────────────────────────────▶ │
     │                                │  JwtRefreshGuard
     │                                │       │
     │                                │       ▼
     │                                │  JwtRefreshStrategy.validate()
     │                                │       │
     │                                │       ├─▶ Extract from body
     │                                │       ├─▶ Verify with REFRESH secret
     │                                │       ├─▶ Check not blacklisted
     │                                │       └─▶ Check type === 'refresh'
     │                                │
     │                                │  AuthService.refreshTokens()
     │                                │       │
     │                                │       ├─▶ Blacklist old refresh token
     │                                │       └─▶ Generate new token pair
     │                                │
     │  { accessToken, refreshToken } │
     │ ◀───────────────────────────── │


4. LOGOUT (Blacklists Tokens)
   ═══════════════════════════
   Client                           Server
     │                                │
     │  POST /api/auth/logout         │
     │  Authorization: Bearer <token> │
     │  { refreshToken? }             │
     │ ─────────────────────────────▶ │
     │                                │  JwtAuthGuard (validates access token)
     │                                │       │
     │                                │       ▼
     │                                │  AuthService.logout()
     │                                │       │
     │                                │       ├─▶ Add access token to blacklist
     │                                │       ├─▶ Add refresh token to blacklist
     │                                │       └─▶ Log to audit
     │                                │
     │  { message: "Logged out" }     │
     │ ◀───────────────────────────── │
```

### Auth API Endpoints

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/api/auth/login` | No | Login with email/password |
| POST | `/api/auth/refresh` | Refresh Token | Get new token pair |
| POST | `/api/auth/logout` | Access Token | Invalidate tokens |
| GET | `/api/auth/me` | Access Token | Get current user profile |

### Default Credentials

The system automatically creates a default admin user on startup:

| Field | Value |
|-------|-------|
| Email | `admin@example.com` |
| Password | `admin123` |
| Roles | `admin`, `user` |

> **Warning:** Change these credentials in production!

### Security Features

1. **Separate secrets** - Access and refresh tokens use different secrets
2. **Token blacklisting** - Revoked tokens are blacklisted until expiry
3. **Token type validation** - Prevents using refresh tokens as access tokens
4. **User status check** - Deactivated users can't authenticate
5. **Audit logging** - All auth events logged to MongoDB
6. **Password hashing** - bcrypt with cost factor 10

### Key Files

| File | Purpose |
|------|---------|
| `backend/src/auth/auth.service.ts` | Login, logout, token generation |
| `backend/src/auth/auth.controller.ts` | Auth endpoints |
| `backend/src/auth/strategies/jwt.strategy.ts` | Access token validation |
| `backend/src/auth/strategies/jwt-refresh.strategy.ts` | Refresh token validation |
| `backend/src/auth/guards/jwt-auth.guard.ts` | Protects routes requiring auth |
| `backend/src/auth/guards/roles.guard.ts` | Enforces role requirements |
| `backend/src/auth/token-blacklist.service.ts` | In-memory token blacklist |

---

## Authorization System

This section explains how role-based access control (RBAC) is implemented using decorators, guards, and enums.

### Role Enum

Roles are defined as a TypeScript enum in `backend/src/common/enums/role.enum.ts`:

```typescript
export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}
```

| Role | Description | Typical Access |
|------|-------------|----------------|
| `USER` | Standard user | Own profile, own files |
| `ADMIN` | Administrator | All users, all files, audit logs |

Users can have **multiple roles**. The default admin has both `['admin', 'user']`.

### Authorization Decorators

Three custom decorators control access to routes:

#### 1. `@Roles()` - Require Specific Roles

**File:** `backend/src/auth/decorators/roles.decorator.ts`

```typescript
import { SetMetadata } from '@nestjs/common';
import { Role } from '@/common/enums/role.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
```

**Usage:**
```typescript
@Roles(Role.ADMIN)           // Only admins
@Roles(Role.USER)            // Only users
@Roles(Role.ADMIN, Role.USER) // Either admin OR user (not both required)
```

**How it works:**
1. `SetMetadata()` attaches role requirements to the route handler
2. `RolesGuard` reads this metadata using `Reflector`
3. Guard checks if user has ANY of the required roles

#### 2. `@Public()` - Mark Route as Public

**File:** `backend/src/auth/decorators/public.decorator.ts`

```typescript
import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
```

**Usage:**
```typescript
@Public()  // No authentication required
@Get('public-data')
async getPublicData() { ... }
```

**How it works:**
1. Sets `isPublic: true` metadata on the route
2. `JwtAuthGuard` checks this metadata BEFORE validating token
3. If `isPublic` is true, guard allows request without authentication

#### 3. `@CurrentUser()` - Extract User from Request

**File:** `backend/src/auth/decorators/current-user.decorator.ts`

```typescript
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<{ user?: Record<string, unknown> }>();
    const user = request.user;

    if (!user) {
      return null;
    }

    return data ? user[data] : user;  // Can extract specific field
  },
);
```

**Usage:**
```typescript
// Get entire user object
@Get('profile')
async getProfile(@CurrentUser() user: AuthenticatedUser) {
  console.log(user);  // { userId, email, roles }
}

// Get specific field
@Get('my-id')
async getMyId(@CurrentUser('userId') userId: string) {
  console.log(userId);  // "uuid-string"
}
```

**How it works:**
1. `JwtStrategy.validate()` returns user data and attaches it to `request.user`
2. `@CurrentUser()` decorator extracts this from the request
3. Optional `data` parameter allows extracting a specific field

### Guards

Guards run BEFORE the route handler and determine if the request should proceed.

#### JwtAuthGuard - Authentication

**File:** `backend/src/auth/guards/jwt-auth.guard.ts`

```typescript
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // Check if route is marked as @Public()
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),  // Check method decorator
      context.getClass(),    // Check class decorator
    ]);

    if (isPublic) {
      return true;  // Skip authentication for public routes
    }

    return super.canActivate(context);  // Run Passport JWT validation
  }

  handleRequest<TUser>(err: Error | null, user: TUser | false, info: Error | undefined): TUser {
    if (err || !user) {
      throw err || new UnauthorizedException(info?.message ?? 'Unauthorized');
    }
    return user;
  }
}
```

**Execution Flow:**
```
Request arrives
     │
     ▼
┌─────────────────────────┐
│   JwtAuthGuard          │
│   canActivate()         │
├─────────────────────────┤
│ 1. Check @Public()      │──▶ If public, return true (skip auth)
│ 2. Call Passport JWT    │
│    └─▶ JwtStrategy      │
│        .validate()      │
│ 3. Attach user to req   │
└─────────────────────────┘
     │
     ▼
Request proceeds (or 401)
```

#### RolesGuard - Authorization

**File:** `backend/src/auth/guards/roles.guard.ts`

```typescript
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get required roles from @Roles() decorator
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // No @Roles() decorator = no role restriction
    if (!requiredRoles) {
      return true;
    }

    // Get user from request (set by JwtAuthGuard)
    const request = context.switchToHttp().getRequest<{ user?: RequestUser }>();
    const user = request.user;

    if (!user) {
      return false;  // No user = deny access
    }

    // Check if user has ANY of the required roles
    return requiredRoles.some((role) => user.roles.includes(role));
  }
}
```

**Execution Flow:**
```
After JwtAuthGuard passes
          │
          ▼
┌─────────────────────────────┐
│      RolesGuard             │
│      canActivate()          │
├─────────────────────────────┤
│ 1. Read @Roles() metadata   │
│ 2. If no roles required     │──▶ return true
│ 3. Get user from request    │
│ 4. Check user.roles         │
│    includes any required    │
└─────────────────────────────┘
          │
          ▼
   true = proceed
   false = 403 Forbidden
```

### Guard Execution Order

**Important:** Guards execute in the order they are listed in `@UseGuards()`:

```typescript
@UseGuards(JwtAuthGuard, RolesGuard)  // Auth first, then roles
```

```
┌────────────────────────────────────────────────────────────────┐
│                     REQUEST PIPELINE                            │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Request ──▶ JwtAuthGuard ──▶ RolesGuard ──▶ Route Handler     │
│                   │               │                             │
│                   │               └─▶ Checks roles              │
│                   │                   (user already on request) │
│                   │                                             │
│                   └─▶ Validates JWT token                       │
│                       Attaches user to request                  │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

### Complete Example: AdminController

**File:** `backend/src/admin/admin.controller.ts`

This controller demonstrates class-level guards and decorators:

```typescript
@Controller('admin/users')
@UseGuards(JwtAuthGuard, RolesGuard)  // Applied to ALL routes in this controller
@Roles(Role.ADMIN)                     // ALL routes require ADMIN role
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
}
```

**Request Flow for `GET /api/admin/users`:**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    GET /api/admin/users                                      │
│                    Authorization: Bearer <token>                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  STEP 1: JwtAuthGuard                                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│  • Check @Public() on findAll() method → Not found                          │
│  • Check @Public() on AdminController class → Not found                     │
│  • Call Passport JWT Strategy                                                │
│    └─▶ Extract token from Authorization header                              │
│    └─▶ Verify signature with JWT_SECRET                                     │
│    └─▶ Check token not expired                                              │
│    └─▶ Check token not blacklisted                                          │
│    └─▶ Check token type === 'access'                                        │
│    └─▶ Load user, verify active                                             │
│    └─▶ Return { userId, email, roles }                                      │
│  • Attach user to request.user                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  STEP 2: RolesGuard                                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│  • Read @Roles() from findAll() method → Not found                          │
│  • Read @Roles() from AdminController class → [Role.ADMIN]                  │
│  • Get user from request.user → { userId, email, roles: ['admin', 'user'] } │
│  • Check: ['admin', 'user'].includes('admin') → true                        │
│  • Return true (allow access)                                                │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  STEP 3: Route Handler                                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│  • AdminController.findAll() executes                                        │
│  • Returns list of users                                                     │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Mixed Access Example: StorageController

**File:** `backend/src/storage/storage.controller.ts`

This controller shows how to mix protected and public routes:

```typescript
@Controller('files')
@UseGuards(JwtAuthGuard)  // Default: all routes require authentication
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  // Protected: requires valid JWT
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadDto: UploadFileDto,
    @CurrentUser() user: JwtUser,  // User is guaranteed to exist
  ) {
    return this.storageService.upload(file, uploadDto, user.id, user.email);
  }

  // Protected: requires valid JWT
  @Get('user/my-files')
  async getMyFiles(@CurrentUser() user: JwtUser) {
    return this.storageService.findByUser(user.id);
  }

  // PUBLIC: anyone can access (overrides class-level guard)
  @Public()
  @Get('public')
  async findPublic(@Query() query: FileQueryDto) {
    query.visibility = FileVisibility.PUBLIC;
    return this.storageService.findAll(query);
  }

  // PUBLIC: anyone can download public files
  @Public()
  @Get(':id/download/public')
  async downloadPublic(@Param('id') id: string, @Res() res: Response) {
    // Only works for files with visibility: PUBLIC
    return this.storageService.download(id, undefined);
  }

  // Protected: user can access their own files or public files
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: JwtUser | null,  // May be null if somehow bypassed
  ) {
    return this.storageService.findById(id, user?.id);
  }
}
```

**Access Summary:**

| Endpoint | Decorator | Auth Required | Who Can Access |
|----------|-----------|---------------|----------------|
| `POST /files/upload` | (none) | Yes | Any authenticated user |
| `GET /files/user/my-files` | (none) | Yes | Any authenticated user |
| `GET /files/public` | `@Public()` | No | Anyone |
| `GET /files/:id/download/public` | `@Public()` | No | Anyone (public files only) |
| `GET /files/:id` | (none) | Yes | Owner or public files |

### Creating a New Protected Controller

Here's a template for creating a new controller with authentication:

```typescript
import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { Roles } from '@/auth/decorators/roles.decorator';
import { Public } from '@/auth/decorators/public.decorator';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { Role } from '@/common/enums/role.enum';

interface AuthenticatedUser {
  userId: string;
  email: string;
  roles: string[];
}

@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)  // Protect all routes by default
export class ProductsController {

  // Public endpoint - no auth required
  @Public()
  @Get()
  async findAll() {
    return []; // Anyone can list products
  }

  // Any authenticated user
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return {}; // Any logged-in user can view
  }

  // Only admins can create
  @Post()
  @Roles(Role.ADMIN)
  async create(
    @Body() createDto: CreateProductDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    console.log(`Created by: ${user.email}`);
    return {};
  }

  // User-specific data
  @Get('user/favorites')
  async getMyFavorites(@CurrentUser() user: AuthenticatedUser) {
    return []; // Get favorites for user.userId
  }
}
```

### Decorator & Guard Quick Reference

| Decorator/Guard | Location | Purpose |
|-----------------|----------|---------|
| `@UseGuards(JwtAuthGuard)` | Class or Method | Enable JWT authentication |
| `@UseGuards(RolesGuard)` | Class or Method | Enable role checking |
| `@Roles(Role.ADMIN)` | Class or Method | Require specific role(s) |
| `@Public()` | Method | Skip authentication |
| `@CurrentUser()` | Parameter | Get authenticated user |
| `@CurrentUser('userId')` | Parameter | Get specific user field |

### Common Patterns

```typescript
// 1. All routes protected, all require ADMIN
@Controller('admin/settings')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminSettingsController { }

// 2. All routes protected, different roles per method
@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
  @Get()
  @Roles(Role.ADMIN)  // Only admins see all orders
  findAll() { }

  @Get('my-orders')   // No @Roles = any authenticated user
  findMyOrders(@CurrentUser() user) { }
}

// 3. Mix of public and protected
@Controller('articles')
@UseGuards(JwtAuthGuard)  // No RolesGuard needed
export class ArticlesController {
  @Public()
  @Get()
  findPublished() { }  // Anyone

  @Post()
  create(@CurrentUser() user) { }  // Authenticated only
}

// 4. Completely public controller
@Controller('health')
export class HealthController {  // No guards at all
  @Get()
  check() { return { status: 'ok' }; }
}
```

---

## Resource-Level Authorization

Guards and decorators handle **route-level** authorization ("Can this user access this endpoint?"). But many applications need **resource-level** authorization ("Can this user access THIS specific resource?").

### The Two Levels of Authorization

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        AUTHORIZATION LEVELS                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  LEVEL 1: Route-Level (Guards & Decorators)                                 │
│  ──────────────────────────────────────────                                 │
│  Question: "Can this user access this ENDPOINT?"                            │
│  Handled by: @UseGuards(), @Roles(), @Public()                              │
│  Examples:                                                                   │
│    • Only admins can access /admin/*                                        │
│    • Only authenticated users can POST /files                               │
│    • Anyone can GET /public/*                                               │
│                                                                              │
│  LEVEL 2: Resource-Level (Service Logic)                                    │
│  ───────────────────────────────────────                                    │
│  Question: "Can this user perform this action on THIS RESOURCE?"            │
│  Handled by: Ownership checks in service methods                            │
│  Examples:                                                                   │
│    • Users can only delete their OWN files                                  │
│    • Users can only update their OWN profile                                │
│    • Admins can modify ANY user                                             │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Why Guards Aren't Enough

Consider this scenario:

```typescript
// This guard setup is NOT sufficient!
@Controller('files')
@UseGuards(JwtAuthGuard)
export class FilesController {
  @Delete(':id')
  async deleteFile(@Param('id') id: string) {
    // PROBLEM: Any authenticated user can delete ANY file!
    return this.filesService.delete(id);
  }
}
```

The guard only checks "is the user logged in?" but not "does this user own this file?"

### Ownership Checks in Services

Resource-level authorization belongs in **service methods**, not controllers. Here's the pattern from `StorageService`:

```typescript
// storage.service.ts

async delete(id: string, userId: string): Promise<void> {
  const metadata = await this.fileMetadataModel.findById(id).exec();

  // 1. Check resource exists
  if (!metadata) {
    throw new NotFoundException('File not found');
  }

  // 2. Check ownership (RESOURCE-LEVEL AUTHORIZATION)
  if (metadata.uploadedBy !== userId) {
    throw new ForbiddenException('Only the file owner can delete this file');
  }

  // 3. Perform action
  await this.s3Client.send(new DeleteObjectCommand({ ... }));
  await this.fileMetadataModel.findByIdAndDelete(id).exec();
}
```

The controller passes the user ID, and the service decides if the action is allowed:

```typescript
// storage.controller.ts

@Delete(':id')
async delete(
  @Param('id') id: string,
  @CurrentUser() user: JwtUser,  // Get authenticated user
) {
  // Pass user ID to service for ownership check
  await this.storageService.delete(id, user.id);
  return { message: 'File deleted successfully' };
}
```

### Common Authorization Patterns

#### Pattern 1: Owner-Only Access

```typescript
// Only the resource owner can access
async update(id: string, updateDto: UpdateDto, userId: string): Promise<Resource> {
  const resource = await this.repository.findById(id);

  if (!resource) {
    throw new NotFoundException('Resource not found');
  }

  if (resource.ownerId !== userId) {
    throw new ForbiddenException('Access denied');
  }

  return this.repository.update(id, updateDto);
}
```

#### Pattern 2: Owner OR Admin Access

```typescript
// Owner can access their own, admin can access any
async findOne(
  id: string,
  userId: string,
  userRoles: string[]
): Promise<Resource> {
  const resource = await this.repository.findById(id);

  if (!resource) {
    throw new NotFoundException('Resource not found');
  }

  const isOwner = resource.ownerId === userId;
  const isAdmin = userRoles.includes(Role.ADMIN);

  if (!isOwner && !isAdmin) {
    throw new ForbiddenException('Access denied');
  }

  return resource;
}
```

#### Pattern 3: Public OR Owner Access (like StorageService)

```typescript
// Public resources accessible to all, private only to owner
async findById(
  id: string,
  userId?: string,  // Optional - may not be authenticated
): Promise<FileMetadata> {
  const metadata = await this.fileMetadataModel.findById(id).exec();

  if (!metadata) {
    throw new NotFoundException('File not found');
  }

  // Public files: anyone can access
  if (metadata.visibility === FileVisibility.PUBLIC) {
    return metadata;
  }

  // Private files: only owner can access
  if (metadata.uploadedBy !== userId) {
    throw new ForbiddenException('Access denied');
  }

  return metadata;
}
```

#### Pattern 4: Users Modify Own Profile, Admins Modify Any

This is a common pattern that's **NOT yet implemented** in this codebase. Here's how to add it:

```typescript
// users.service.ts - Enhanced with resource-level auth

async updateProfile(
  targetUserId: string,
  updateDto: UpdateProfileDto,
  requestingUserId: string,
  requestingUserRoles: string[],
): Promise<User> {
  const user = await this.userRepository.findOne({ where: { id: targetUserId } });

  if (!user) {
    throw new NotFoundException('User not found');
  }

  const isSelf = targetUserId === requestingUserId;
  const isAdmin = requestingUserRoles.includes(Role.ADMIN);

  // Authorization check
  if (!isSelf && !isAdmin) {
    throw new ForbiddenException('You can only update your own profile');
  }

  // Restrict what non-admins can update
  if (!isAdmin) {
    // Regular users can't change their own roles or active status
    if (updateDto.roles !== undefined || updateDto.isActive !== undefined) {
      throw new ForbiddenException('You cannot modify roles or account status');
    }
  }

  // Proceed with update...
  if (updateDto.email) user.email = updateDto.email;
  if (updateDto.name) user.name = updateDto.name;
  if (updateDto.password) user.setPassword(updateDto.password);

  // Only admins can change these
  if (isAdmin) {
    if (updateDto.roles) user.roles = updateDto.roles;
    if (updateDto.isActive !== undefined) user.isActive = updateDto.isActive;
  }

  return this.userRepository.save(user);
}
```

And the controller:

```typescript
// users.controller.ts - User-facing profile endpoint

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Any user can update their own profile
  @Put('me')
  async updateMyProfile(
    @Body() updateDto: UpdateProfileDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.usersService.updateProfile(
      user.userId,      // Target: themselves
      updateDto,
      user.userId,      // Requester: themselves
      user.roles,
    );
  }

  // Admins can update any user via admin routes
  // (Already exists in AdminController)
}
```

### Field-Level Authorization

Sometimes different users can update different fields:

```typescript
// Define what each role can update
const UPDATABLE_FIELDS = {
  [Role.USER]: ['name', 'email', 'password', 'avatar'],  // Own profile fields
  [Role.ADMIN]: ['name', 'email', 'password', 'avatar', 'roles', 'isActive'],  // All fields
};

async updateUser(
  targetId: string,
  updateDto: Record<string, unknown>,
  requesterId: string,
  requesterRoles: string[],
): Promise<User> {
  const user = await this.findById(targetId);
  const isSelf = targetId === requesterId;
  const isAdmin = requesterRoles.includes(Role.ADMIN);

  if (!isSelf && !isAdmin) {
    throw new ForbiddenException('Access denied');
  }

  // Determine allowed fields based on role
  const allowedFields = isAdmin
    ? UPDATABLE_FIELDS[Role.ADMIN]
    : UPDATABLE_FIELDS[Role.USER];

  // Filter out unauthorized field updates
  const sanitizedDto: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(updateDto)) {
    if (allowedFields.includes(key) && value !== undefined) {
      sanitizedDto[key] = value;
    }
  }

  // Check if trying to update unauthorized fields
  const attemptedFields = Object.keys(updateDto).filter(k => updateDto[k] !== undefined);
  const unauthorizedFields = attemptedFields.filter(f => !allowedFields.includes(f));

  if (unauthorizedFields.length > 0) {
    throw new ForbiddenException(
      `You cannot update these fields: ${unauthorizedFields.join(', ')}`
    );
  }

  return this.update(targetId, sanitizedDto);
}
```

### Authorization Decision Matrix

Use a matrix to plan authorization logic:

| Action | Owner | Admin | Other Users | Public |
|--------|-------|-------|-------------|--------|
| View own profile | ✅ | ✅ | ❌ | ❌ |
| Update own profile | ✅ | ✅ | ❌ | ❌ |
| Change own password | ✅ | ✅ | ❌ | ❌ |
| Change own roles | ❌ | ✅ | ❌ | ❌ |
| Deactivate own account | ❌ | ✅ | ❌ | ❌ |
| View other's profile | ❌ | ✅ | ❌ | ❌ |
| View public file | ✅ | ✅ | ✅ | ✅ |
| View private file | ✅ (owner) | ✅ | ❌ | ❌ |
| Delete own file | ✅ | ✅ | ❌ | ❌ |
| Delete other's file | ❌ | ✅ | ❌ | ❌ |

### Best Practices

1. **Always pass userId to service methods** - Don't rely on "the controller checked it"
   ```typescript
   // Good
   async delete(id: string, userId: string): Promise<void>

   // Bad - no way to verify ownership
   async delete(id: string): Promise<void>
   ```

2. **Check ownership BEFORE performing actions** - Fail fast
   ```typescript
   // Good - check first
   if (resource.ownerId !== userId) {
     throw new ForbiddenException();
   }
   await this.expensiveOperation();

   // Bad - wasted work if unauthorized
   await this.expensiveOperation();
   if (resource.ownerId !== userId) { ... }
   ```

3. **Use ForbiddenException (403), not UnauthorizedException (401)**
   - 401 = "Who are you?" (authentication)
   - 403 = "You can't do that" (authorization)

4. **Don't leak information in error messages**
   ```typescript
   // Good - generic message
   throw new ForbiddenException('Access denied');

   // Bad - reveals resource exists
   throw new ForbiddenException('You do not own file xyz-123');
   ```

5. **Consider using a dedicated authorization service for complex rules**
   ```typescript
   @Injectable()
   export class AuthorizationService {
     canUserModifyResource(user: User, resource: Resource): boolean {
       if (user.roles.includes(Role.ADMIN)) return true;
       if (resource.ownerId === user.id) return true;
       if (resource.visibility === 'public' && action === 'read') return true;
       return false;
     }
   }
   ```

### Current Implementation Status

| Resource | Owner-Only | Admin Override | Notes |
|----------|------------|----------------|-------|
| Files (StorageService) | ✅ | ❌ | Owner can CRUD, no admin override |
| Users (UsersService) | ❌ | N/A | Admin-only via AdminController |
| Audit Logs | N/A | ✅ | Read-only for admins |

**Gap:** Users cannot currently update their own profile (name, password). This would require:
1. A new `UsersController` with `/users/me` endpoints
2. Resource-level checks in `UsersService.updateProfile()`

## Troubleshooting

### Dev Container won't start
- Ensure Docker Desktop is running
- Try rebuilding: `F1` → `Dev Containers: Rebuild Container`

### Database credentials not being set (POSTGRES_USER, MONGO_USER warnings)
If you see warnings like `The "POSTGRES_USER" variable is not set`:
```bash
# Copy .env to devcontainer folder
cp .env .devcontainer/.env
```
Then rebuild the container.

### Port already in use
```bash
# Find process using port (e.g., 3000)
lsof -i :3000

# Kill the process
kill -9 <PID>
```

### Dependencies out of sync
```bash
npm run reinstall
```

### npm deprecation warnings for glob@10.5.0

You may see warnings like:
```
npm warn deprecated glob@10.5.0: Old versions of glob are not supported...
```

This is an **upstream issue** that cannot be resolved through overrides. Jest@30 and TypeORM explicitly require `glob@^10.x`, and version 10.5.0 is the latest in the 10.x series. The glob maintainer has deprecated all 10.x versions in favor of 11+, but Jest and TypeORM have not yet updated their dependencies.

This warning is safe to ignore. It will be resolved automatically when Jest and TypeORM release updates that use glob 11+.

### ESLint/TypeScript errors after pulling
```bash
# Restart TypeScript server in VS Code
F1 → "TypeScript: Restart TS Server"
```

## Learn More

### Frontend
- [React Documentation](https://react.dev/)
- [Vite Guide](https://vite.dev/guide/)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [Vitest Documentation](https://vitest.dev/)

### Backend
- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeORM Documentation](https://typeorm.io/) (for PostgreSQL)
- [Mongoose Documentation](https://mongoosejs.com/) (for MongoDB)

### Tools
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/)
- [ESLint Documentation](https://eslint.org/docs/latest/)
- [Prettier Documentation](https://prettier.io/docs/en/)

## License

Copyright (c) 2026 Ceralumelabs India (OPC) Private Limited. All rights reserved.

This is proprietary software provided for educational purposes as part of the PCFS course. See [LICENSE.txt](LICENSE.txt) for details.
