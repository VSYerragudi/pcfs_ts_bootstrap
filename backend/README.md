# Backend - NestJS API

This is the backend service for the PCFS Demo application, built with NestJS 11.

## Tech Stack

- **Framework**: NestJS 11
- **Language**: TypeScript 6
- **Testing**: Jest 30
- **Databases**: PostgreSQL 18, MongoDB 8.2
- **Storage**: SeaweedFS (S3-compatible)

## Project Structure

```
backend/
├── src/
│   ├── main.ts              # Application bootstrap
│   ├── app.module.ts        # Root module
│   ├── app.controller.ts    # Root controller
│   ├── app.service.ts       # Root service
│   └── app.controller.spec.ts  # Unit tests
├── test/
│   ├── app.e2e-spec.ts      # E2E tests
│   └── jest-e2e.json        # E2E Jest config
├── package.json
├── tsconfig.json            # TypeScript configuration
└── nest-cli.json            # NestJS CLI configuration
```

## Development

All commands should be run from the **project root** using npm workspaces:

```bash
# Start in watch mode
npm run dev:backend

# Run unit tests
npm run test:backend

# Run E2E tests
npm run test:e2e

# Type check
npm run typecheck:backend

# Build for production
npm run build:backend
```

Or run directly from the backend folder:

```bash
cd backend

# Start in watch mode
npm run start:dev

# Run unit tests
npm run test

# Run E2E tests
npm run test:e2e

# Build
npm run build
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check / Welcome message |

## Adding New Modules

Use the NestJS CLI to generate new modules:

```bash
cd backend

# Generate a new module
npx nest g module users

# Generate a controller
npx nest g controller users

# Generate a service
npx nest g service users

# Generate all at once (resource)
npx nest g resource products
```

## Environment Variables

Environment variables are loaded from the root `.env` file:

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 3000) |
| `NODE_ENV` | Environment mode |
| `POSTGRES_*` | PostgreSQL connection settings |
| `MONGO_*` | MongoDB connection settings |
| `SEAWEEDFS_*` | SeaweedFS connection settings |

## Testing

### Unit Tests

Unit tests are co-located with source files using the `.spec.ts` suffix:

```bash
npm run test           # Run all unit tests
npm run test:watch     # Run in watch mode
npm run test:cov       # Run with coverage
```

### E2E Tests

E2E tests are located in the `test/` directory:

```bash
npm run test:e2e       # Run E2E tests
```

## Learn More

- [NestJS Documentation](https://docs.nestjs.com)
- [TypeORM Documentation](https://typeorm.io/) (for PostgreSQL)
- [Mongoose Documentation](https://mongoosejs.com/) (for MongoDB)
