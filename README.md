# Rev — Project Setup Guide

A social car review platform for iOS & Android. This guide covers local environment setup for every layer of the stack.

---

## Table of contents

1. [Prerequisites](#prerequisites)
2. [Repo structure](#repo-structure)
3. [Backend — Go + Fiber](#backend--go--fiber)
4. [Database — PostgreSQL + Redis](#database--postgresql--redis)
5. [Frontend — React Native + Expo](#frontend--react-native--expo)
6. [Environment variables](#environment-variables)
7. [Running the project](#running-the-project)
8. [Useful commands](#useful-commands)

---

## Prerequisites

Install these before anything else.

| Tool | Version | Install |
|------|---------|---------|
| Go | 1.22+ | https://go.dev/dl |
| Node.js | 20+ | https://nodejs.org |
| Docker + Docker Compose | Latest | https://docs.docker.com/get-docker |
| sqlc | Latest | `go install github.com/sqlc-dev/sqlc/cmd/sqlc@latest` |
| golang-migrate | Latest | `go install -tags 'postgres' github.com/golang-migrate/migrate/v4/cmd/migrate@latest` |
| Expo CLI | Latest | `npm install -g expo-cli` |
| EAS CLI | Latest | `npm install -g eas-cli` |

Verify everything is installed:

```bash
go version
node --version
docker --version
sqlc version
migrate -version
expo --version
eas --version
```

---

## Repo structure

```
rev/
├── backend/
│   ├── cmd/
│   │   └── server/         # main.go entry point
│   ├── internal/
│   │   ├── auth/           # JWT/Paseto token logic
│   │   ├── handler/        # HTTP handlers (Fiber)
│   │   ├── middleware/     # Auth middleware, CORS, logging
│   │   └── service/        # Business logic layer
│   ├── db/
│   │   ├── migrations/     # SQL migration files (golang-migrate)
│   │   ├── queries/        # SQL query files (sqlc input)
│   │   └── sqlc/           # Generated Go code (do not edit)
│   ├── scripts/            # NHTSA seed script, utility scripts
│   ├── sqlc.yaml
│   ├── Makefile
│   └── go.mod
├── app/
│   ├── app/                # Expo Router screens
│   ├── components/         # Shared UI components
│   ├── store/              # Zustand stores
│   ├── lib/                # API client, utils
│   ├── assets/
│   ├── app.json
│   └── package.json
├── docs/
│   └── api-contract.md     # Endpoint specs (Mekha + Aashay maintain)
├── docker-compose.yml
└── README.md
```

---

## Backend — Go + Fiber

### 1. Clone and install dependencies

```bash
git clone https://github.com/your-org/rev.git
cd rev/backend
go mod download
```

### 2. Install Fiber and other Go dependencies

```bash
go get github.com/gofiber/fiber/v2
go get github.com/gofiber/fiber/v2/middleware/cors
go get github.com/gofiber/fiber/v2/middleware/logger
go get github.com/jackc/pgx/v5
go get github.com/o1ecc8b9/paseto
go get github.com/redis/go-redis/v9
go get github.com/joho/godotenv
```

After adding dependencies, tidy the module:

```bash
go mod tidy
```

### 3. Project entry point

Create `backend/cmd/server/main.go`:

```go
package main

import (
    "log"
    "os"

    "github.com/gofiber/fiber/v2"
    "github.com/gofiber/fiber/v2/middleware/cors"
    "github.com/gofiber/fiber/v2/middleware/logger"
    "github.com/joho/godotenv"
)

func main() {
    if err := godotenv.Load(); err != nil {
        log.Println("No .env file found, reading from environment")
    }

    app := fiber.New(fiber.Config{
        AppName: "Rev API v1",
    })

    app.Use(logger.New())
    app.Use(cors.New())

    app.Get("/health", func(c *fiber.Ctx) error {
        return c.JSON(fiber.Map{"status": "ok"})
    })

    port := os.Getenv("PORT")
    if port == "" {
        port = "8080"
    }

    log.Fatal(app.Listen(":" + port))
}
```

### 4. Makefile

Create `backend/Makefile` for common commands:

```makefile
.PHONY: run build test lint migrate-up migrate-down sqlc-gen seed

run:
	go run ./cmd/server/main.go

build:
	go build -o bin/server ./cmd/server

test:
	go test ./... -v

lint:
	golangci-lint run ./...

migrate-up:
	migrate -path db/migrations -database "$(DATABASE_URL)" up

migrate-down:
	migrate -path db/migrations -database "$(DATABASE_URL)" down 1

sqlc-gen:
	sqlc generate

seed:
	go run ./scripts/seed/main.go
```

---

## Database — PostgreSQL + Redis

### 1. Start services with Docker Compose

Create `docker-compose.yml` in the project root:

```yaml
version: "3.9"

services:
  postgres:
    image: postgres:16-alpine
    container_name: rev_postgres
    environment:
      POSTGRES_USER: rev
      POSTGRES_PASSWORD: rev_secret
      POSTGRES_DB: rev_dev
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    container_name: rev_redis
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

Start both services:

```bash
docker compose up -d
```

Verify they are running:

```bash
docker compose ps
```

### 2. Create the first migration

```bash
cd backend
migrate create -ext sql -dir db/migrations -seq init_schema
```

This creates two files in `db/migrations/`:

- `000001_init_schema.up.sql` — runs when migrating up
- `000001_init_schema.down.sql` — runs when rolling back

Paste the schema into the up file:

```sql
-- 000001_init_schema.up.sql

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE cars (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    make TEXT NOT NULL,
    model TEXT NOT NULL,
    year INT NOT NULL,
    body_type TEXT,
    UNIQUE (make, model, year)
);

CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    car_id UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
    overall_rating NUMERIC(3,1) NOT NULL CHECK (overall_rating BETWEEN 1 AND 10),
    comfort_rating NUMERIC(3,1),
    speed_rating NUMERIC(3,1),
    handling_rating NUMERIC(3,1),
    interior_rating NUMERIC(3,1),
    reliability_rating NUMERIC(3,1),
    value_rating NUMERIC(3,1),
    pros TEXT[],
    cons TEXT[],
    photo_urls TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE garage_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    car_id UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('owned', 'previously_owned', 'driven')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, car_id)
);

CREATE INDEX idx_reviews_car_id ON reviews(car_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_garage_user_id ON garage_entries(user_id);
```

And the down file:

```sql
-- 000001_init_schema.down.sql

DROP TABLE IF EXISTS garage_entries;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS cars;
DROP TABLE IF EXISTS users;
DROP EXTENSION IF EXISTS "uuid-ossp";
```

### 3. Run migrations

```bash
export DATABASE_URL="postgres://rev:rev_secret@localhost:5432/rev_dev?sslmode=disable"
make migrate-up
```

### 4. Configure sqlc

Create `backend/sqlc.yaml`:

```yaml
version: "2"
sql:
  - engine: "postgresql"
    queries: "db/queries"
    schema: "db/migrations"
    gen:
      go:
        package: "db"
        out: "db/sqlc"
        emit_json_tags: true
        emit_prepared_queries: false
        emit_interface: true
        emit_exact_table_names: false
```

Write a query, then generate:

```bash
make sqlc-gen
```

---

## Frontend — React Native + Expo

### 1. Initialize the Expo project

```bash
cd rev/app
npx create-expo-app . --template blank-typescript
```

Or if the `app/` directory already exists in the repo, just install dependencies:

```bash
cd rev/app
npm install
```

### 2. Install core dependencies

```bash
# Navigation
npx expo install expo-router react-native-safe-area-context react-native-screens

# Styling
npm install nativewind
npm install --save-dev tailwindcss

# State management
npm install zustand @tanstack/react-query

# Auth
npx expo install expo-auth-session expo-crypto expo-web-browser

# Media
npx expo install expo-image-picker expo-image

# Notifications (nice to have, deprioritize for MVP)
npx expo install expo-notifications
```

### 3. Configure NativeWind (Tailwind for React Native)

Initialize Tailwind:

```bash
npx tailwindcss init
```

Update `tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Rev design tokens — dark mode first
        "rev-bg": "#0a0a0a",
        "rev-surface": "#141414",
        "rev-accent": "#1D6BFF",  // electric blue
        "rev-accent-red": "#E8210A",
      },
    },
  },
  plugins: [],
};
```

Update `babel.config.js`:

```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
  };
};
```

### 4. Configure Expo Router

Update `app.json` to enable the Expo Router scheme:

```json
{
  "expo": {
    "name": "Rev",
    "slug": "rev",
    "scheme": "rev",
    "version": "1.0.0",
    "platforms": ["ios", "android"],
    "experiments": {
      "typedRoutes": true
    },
    "plugins": ["expo-router"]
  }
}
```

Create `app/_layout.tsx` as your root layout:

```tsx
import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }} />
    </QueryClientProvider>
  );
}
```

### 5. Configure the API client

Create `app/lib/api.ts`:

```ts
const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8080";

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message ?? `HTTP ${res.status}`);
  }

  return res.json();
}
```

---

## Environment variables

### Backend — `backend/.env`

```env
# Server
PORT=8080
ENV=development

# Database
DATABASE_URL=postgres://rev:rev_secret@localhost:5432/rev_dev?sslmode=disable

# Redis
REDIS_URL=redis://localhost:6379

# Auth
PASETO_SYMMETRIC_KEY=your-32-byte-secret-key-here-1234
ACCESS_TOKEN_DURATION=15m
REFRESH_TOKEN_DURATION=7d

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Apple OAuth
APPLE_CLIENT_ID=com.yourteam.rev
APPLE_TEAM_ID=YOUR_TEAM_ID
APPLE_KEY_ID=YOUR_KEY_ID
```

> **Never commit `.env` to git.** Add it to `.gitignore` immediately.

### Frontend — `app/.env`

```env
EXPO_PUBLIC_API_URL=http://localhost:8080
```

For production, this becomes your deployed Railway/Render URL.

---

## Running the project

### Start infrastructure (Postgres + Redis)

```bash
# From project root
docker compose up -d
```

### Start the Go backend

```bash
cd backend
make run
# Server starts on http://localhost:8080
# Test: curl http://localhost:8080/health
```

### Start the React Native app

```bash
cd app
npx expo start
```

Then press:

- `i` to open iOS simulator
- `a` to open Android emulator
- `s` to switch to Expo Go (scan QR with your phone)

---

## Useful commands

### Backend

```bash
# Run all tests
make test

# Run linter
make lint

# Create a new migration
migrate create -ext sql -dir db/migrations -seq <migration_name>

# Apply migrations
make migrate-up

# Roll back one migration
make migrate-down

# Regenerate sqlc code after editing queries
make sqlc-gen

# Seed car database from NHTSA
make seed
```

### Frontend

```bash
# Start dev server
npx expo start

# Type check
npx tsc --noEmit

# Clear Expo cache (run if you see strange bundler errors)
npx expo start --clear

# Build for TestFlight (iOS)
eas build --platform ios --profile preview

# Build for Play Store internal track (Android)
eas build --platform android --profile preview
```

### Docker

```bash
# Start services
docker compose up -d

# Stop services
docker compose down

# Reset database (wipes all data)
docker compose down -v && docker compose up -d
```

---

## First-time setup checklist

- [ ] All prerequisites installed and verified
- [ ] Repo cloned, both `backend/` and `app/` dependencies installed
- [ ] Docker running, `docker compose up -d` successful
- [ ] `.env` files created in `backend/` and `app/` (copy from examples above)
- [ ] Migrations applied: `make migrate-up`
- [ ] Backend health check passing: `curl http://localhost:8080/health`
- [ ] Expo dev server running, app loading on simulator or device
- [ ] Google and Apple OAuth credentials added to `backend/.env`

If you hit an issue, check `#eng-help` in the team Slack before spending more than 20 minutes on it.