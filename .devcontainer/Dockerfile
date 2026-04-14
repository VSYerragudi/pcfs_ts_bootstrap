FROM mcr.microsoft.com/devcontainers/typescript-node:24-bookworm

# Install NestJS CLI globally
RUN npm install -g @nestjs/cli

# Install PostgreSQL client for health checks (pg_isready)
RUN apt-get update && apt-get install -y postgresql-client && rm -rf /var/lib/apt/lists/*

# Oh My Zsh is installed via devcontainer feature (common-utils)
# See devcontainer.json for configuration

WORKDIR /workspace