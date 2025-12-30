# Project Structure

This document provides a comprehensive overview of the monorepo structure, explaining each directory and its purpose.

## Overview

This is a **[Turborepo](https://turborepo.com/docs)-powered monorepo** designed for building full-stack applications. It follows a modular architecture with shared packages, tooling configurations, and a Next.js web application.

```
starter-kit/
├── apps/           # Application workspaces
├── packages/       # Shared libraries and utilities
├── tooling/        # Shared development configurations
├── turbo/          # Turborepo generators
├── docs/           # Project documentation
└── patches/        # Package patches (pnpm)
```

---

## Root Configuration Files

| File                  | Purpose                                                                                  |
| --------------------- | ---------------------------------------------------------------------------------------- |
| `package.json`        | Root workspace configuration, shared scripts, and dev dependencies                       |
| `pnpm-workspace.yaml` | Defines workspace packages (`apps/*`, `packages/*`, `tooling/*`) and dependency catalogs |
| `turbo.json`          | Turborepo pipeline configuration for build, lint, test, and other tasks                  |
| `docker-compose.yml`  | Local development services (PostgreSQL, Redis)                                           |
| `vitest.config.ts`    | Root Vitest configuration for unit testing                                               |

---

## Apps

### `apps/web`

The main Next.js application - a full-stack web app with tRPC for end-to-end type safety.

```
apps/web/
├── src/
│   ├── app/              # Next.js App Router pages and layouts
│   │   ├── (authed)/     # Protected routes (requires authentication)
│   │   ├── (public)/     # Public routes
│   │   ├── _components/  # Shared app-level components
│   │   ├── api/          # API routes (tRPC handler)
│   │   ├── layout.tsx    # Root layout
│   │   └── provider.tsx  # Client providers (React Query, etc.)
│   │
│   ├── server/           # Server-side code
│   │   ├── api/          # tRPC router configuration
│   │   │   ├── root.ts   # Root router combining all routers
│   │   │   ├── trpc.ts   # tRPC context and procedures
│   │   │   └── routers/  # Individual tRPC routers
│   │   ├── modules/      # Business logic modules
│   │   │   ├── auth/     # Authentication logic
│   │   │   ├── user/     # User management
│   │   │   ├── mail/     # Email services
│   │   │   └── rate-limit/ # Rate limiting utilities
│   │   ├── session.ts    # Session management (iron-session)
│   │   └── utils/        # Server utilities
│   │
│   ├── trpc/             # tRPC client configuration
│   │   ├── react.tsx     # React Query integration
│   │   ├── server.tsx    # Server-side tRPC caller
│   │   └── query-client.ts # React Query client config
│   │
│   ├── lib/              # Shared utilities
│   │   ├── auth.ts       # Auth helpers
│   │   ├── fonts.ts      # Font configuration
│   │   └── pkce/         # PKCE utilities for OAuth
│   │
│   ├── stories/          # Storybook stories
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Client-side utilities
│   ├── validators/       # Form/input validators
│   ├── constants.ts      # App constants
│   └── env.ts            # Environment variable validation (@t3-oss/env)
│
├── tests/                # Test files
│   ├── msw/              # Mock Service Worker handlers
│   ├── db/               # Database test utilities
│   └── redis/            # Redis test utilities
│
└── public/               # Static assets
```

**Key technologies:**

- **Next.js 15** with App Router and React 19
- **tRPC v11** for type-safe API calls
- **Tailwind CSS v4** for styling
- **React Query** for server state management
- **iron-session** for session management
- **Storybook** for component development

---

## Packages

Shared libraries consumed by applications in the monorepo.

### `packages/db`

Database layer using Prisma ORM with multiple generators.

```
packages/db/
├── prisma/
│   ├── schema.prisma     # Database schema definition
│   ├── migrations/       # Database migrations
│   └── seed.ts           # Database seeding script
├── src/
│   ├── index.ts          # Main export (Prisma client)
│   ├── client.ts         # Prisma client singleton
│   ├── extensions.ts     # Prisma client extensions
│   ├── kysely.ts         # Kysely query builder integration
│   ├── enums.ts          # Database enums
│   └── generated/        # Auto-generated files
│       ├── prisma/       # Prisma client
│       ├── zod/          # Zod validators from schema
│       └── kysely/       # Kysely types
```

**Exports:**

- `@acme/db` - Prisma client with extensions
- `@acme/db/client` - Raw Prisma client
- `@acme/db/validators` - Auto-generated Zod schemas and types
- `@acme/db/kysely` - [Kysely](https://kysely.dev/docs/getting-started) query builder types
- `@acme/db/enums` - Database enums

**Key features:**

- **Prisma** for type-safe database access
- **prisma-zod-generator** for automatic Zod schema generation
- **prisma-kysely** Allows the usage of [Kysely](https://kysely.dev/docs/getting-started) via Prisma extension for complex SQL queries with type safety

---

### `packages/ui`

Shared UI component library built with React Aria Components and OUI design system.

```
packages/ui/
├── src/
│   ├── empty-placeholder.tsx  # Empty state component
│   ├── link-button.tsx        # Link styled as button
│   ├── text-field.tsx         # Form text input
│   ├── toast.tsx              # Toast notifications (sonner)
│   ├── infobox/               # Information box component
│   ├── modal/                 # Modal dialog component
│   ├── restricted-footer/     # Footer component
│   └── svgs/                  # SVG icons and illustrations
```

**Key technologies:**

- **react-aria-components** for accessible components
- **@opengovsg/oui** - OGP's UI library
- **tailwind-variants** for variant-based styling
- **sonner** for toast notifications

---

### `packages/validators`

Shared Zod validation schemas used across the monorepo.

```
packages/validators/
└── src/
    └── index.ts    # Shared validation schemas
```

**Usage:** Define reusable validators for forms, API inputs, and data validation that can be shared between client and server if necessary.

---

### `packages/redis`

Redis client wrapper for caching and session storage.

```
packages/redis/
└── src/
    ├── index.ts    # Redis client export
    └── env.ts      # Redis environment variables
```

**Usage:** Provides a configured Redis client for rate limiting, caching, and session storage.

---

### `packages/common`

Shared utility functions used across the monorepo.

```
packages/common/
└── src/
    └── format.ts   # Date/time formatting utilities (date-fns)
```

**Exports:**

- `@acme/common/format` - Date formatting helpers with timezone support

---

## Tooling

Shared development configurations for consistent tooling across all packages.

### `tooling/eslint`

Shared ESLint configurations with support for different project types.

```
tooling/eslint/
├── base.js       # Base ESLint rules
├── nextjs.js     # Next.js specific rules
├── react.js      # React specific rules
└── storybook.js  # Storybook specific rules
```

**Exports:**

- `@acme/eslint-config/base` - Base TypeScript rules
- `@acme/eslint-config/nextjs` - Next.js app rules
- `@acme/eslint-config/react` - React library rules
- `@acme/eslint-config/storybook` - Storybook rules

---

### `tooling/prettier`

Shared Prettier configuration for consistent code formatting.

```
tooling/prettier/
└── index.js      # Prettier config with plugins
```

**Features:**

- Import sorting with `@ianvs/prettier-plugin-sort-imports`
- Tailwind class sorting with `prettier-plugin-tailwindcss`

---

### `tooling/tailwind`

Shared Tailwind CSS configuration and theme.

```
tooling/tailwind/
├── theme.css         # Custom theme CSS variables
└── postcss-config.js # PostCSS configuration
```

**Exports:**

- `@acme/tailwind-config/theme` - Theme CSS
- `@acme/tailwind-config/postcss-config` - PostCSS config for Tailwind v4

---

### `tooling/typescript`

Shared TypeScript configurations.

```
tooling/typescript/
├── base.json              # Base tsconfig
└── compiled-package.json  # Config for compiled packages
```

**Usage:** Extend from these configs in package `tsconfig.json` files:

```json
{
  "extends": "@acme/tsconfig/base.json"
}
```

---

### `tooling/storybook`

Shared Storybook configuration and utilities.

```
tooling/storybook/
└── src/
    ├── index.ts              # Main exports
    ├── modes.ts              # Theme modes
    ├── viewports.ts          # Viewport presets
    └── withChromaticModes.ts # Chromatic testing utilities
```

**Usage:** Provides consistent Storybook configuration for visual regression testing with Chromatic.

---

### `tooling/github`

GitHub Actions setup utilities.

```
tooling/github/
└── setup/
    └── action.yml    # Reusable setup action
```

**Usage:** Shared GitHub Actions workflow for CI setup (pnpm, caching, etc.).

---

## Turbo Generators

Package scaffolding generators using Turborepo.

```
turbo/generators/
├── config.ts       # Generator configuration
└── templates/      # Template files
    ├── eslint.config.js.hbs
    ├── package.json.hbs
    └── tsconfig.json.hbs
```

**Usage:** Generate a new package:

```bash
pnpm turbo gen init
```

This will scaffold a new package in `packages/` with proper configuration files.

---

## Docker Services

The `docker-compose.yml` provides local development services:

| Service    | Port  | Purpose                          |
| ---------- | ----- | -------------------------------- |
| PostgreSQL | 54321 | Primary database                 |
| Redis      | 63791 | Caching, rate limiting, sessions |

**Start services:**

```bash
docker compose up -d
```

---

## Key Scripts

| Script            | Description                        |
| ----------------- | ---------------------------------- |
| `pnpm dev`        | Start all apps in development mode |
| `pnpm build`      | Build all packages and apps        |
| `pnpm lint`       | Run ESLint across all packages     |
| `pnpm format:fix` | Format code with Prettier          |
| `pnpm typecheck`  | Run TypeScript type checking       |
| `pnpm test`       | Run unit tests with Vitest         |
| `pnpm db:push`    | Push Prisma schema to database     |
| `pnpm db:studio`  | Open Prisma Studio                 |
| `pnpm db:migrate` | Run database migrations            |

---

## Dependency Management

This monorepo uses **pnpm workspaces** with **catalogs** for consistent dependency versions:

```yaml
# pnpm-workspace.yaml
catalog:
  typescript: ^5.9.3
  zod: ^4.1.13
  # ... other shared versions
```

Reference catalog versions in `package.json`:

```json
{
  "dependencies": {
    "zod": "catalog:"
  }
}
```

---

## Environment Variables

Environment variables are validated using `@t3-oss/env`:

- `.env.example` - Template with all required variables
- `.env.local` - Local development overrides (gitignored)

Key variables:

- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `SESSION_SECRET` - Secret for session encryption
- `POSTMAN_API_KEY` - (Optional) For sending emails via Postman
