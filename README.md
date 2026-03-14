# BioBoost

A Turborepo monorepo of health and wellness apps built with React 19, TanStack Router, and shadcn/ui.

## Apps

| App | Port | Description |
|-----|------|-------------|
| `apps/web` | 3000 | Landing page linking to all products |
| `apps/supps` | 3001 | Personalized supplement blends |
| `apps/breathe` | 3002 | Guided breathing exercises |
| `apps/calc` | 3003 | 30+ health & fitness calculators |

## Packages

| Package | Description |
|---------|-------------|
| `packages/ui` | Shared shadcn/ui component library |

## Tech Stack

- **Monorepo:** Turborepo + pnpm workspaces
- **Framework:** React 19, TanStack Router, TanStack Form
- **Styling:** Tailwind CSS v4, shadcn/ui
- **Language:** TypeScript
- **Linting/Formatting:** Biome
- **Testing:** Vitest
- **Icons:** HugeIcons

## Getting Started

```bash
# Install dependencies
pnpm install

# Start all apps in development
pnpm dev

# Start a single app
pnpm --filter calc dev
```

## Environment Variables

Each app reads cross-app URLs from environment variables (defaults to localhost in development). Copy the example files to get started:

```bash
cp apps/web/.env.example apps/web/.env
cp apps/supps/.env.example apps/supps/.env
cp apps/breathe/.env.example apps/breathe/.env
cp apps/calc/.env.example apps/calc/.env
```

| Variable | Used in | Default (dev) |
|----------|---------|---------------|
| `VITE_WEB_URL` | supps, breathe, calc | `http://localhost:3000` |
| `VITE_SUPPS_URL` | web | `http://localhost:3001` |
| `VITE_BREATHE_URL` | web | `http://localhost:3002` |
| `VITE_CALC_URL` | web | `http://localhost:3003` |

## Commands

```bash
pnpm dev          # Start all apps
pnpm build        # Build all apps
pnpm test         # Run all tests
pnpm typecheck    # TypeScript check across all apps
pnpm lint         # Biome lint
pnpm format       # Biome format (writes)
pnpm check        # Biome check (lint + format)
```

## Adding UI Components

Components are added to `packages/ui` and shared across all apps:

```bash
pnpm dlx shadcn@latest add button -c apps/web
```

Then import them anywhere:

```tsx
import { Button } from "@workspace/ui/components/button"
```
