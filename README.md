# Expense Manager

[فارسی](README.fa.md) | English

An in-progress, full-stack application for recording income and expenses and viewing a monthly financial summary. It is organised as an npm-workspaces monorepo with a React client, a Hono API, and PostgreSQL storage.

> **Status:** under active development. The dashboard and transaction workflow are usable; categories, settings, authentication, and production hardening are not complete.

## Contents

- [Features and scope](#features-and-scope)
- [Technology](#technology)
- [Prerequisites](#prerequisites)
- [Quick start](#quick-start)
- [Configuration](#configuration)
- [Available commands](#available-commands)
- [API reference](#api-reference)
- [Data model and migrations](#data-model-and-migrations)
- [Project structure](#project-structure)
- [Production and security notes](#production-and-security-notes)
- [Contributing](#contributing)

## Features and scope

Implemented today:

- Create, list, retrieve, update, and delete transactions through the API.
- Create, list, and delete transactions from the web interface.
- Validate transaction input with Zod in both the API and the creation form.
- Show the current calendar month's income, expenses, balance, daily chart, and five most recent transactions.
- Persist data in PostgreSQL through Drizzle ORM migrations.

Not yet complete:

- The Categories and Settings routes are placeholder pages.
- The API supports `PATCH` updates, but the web interface does not expose editing yet.
- Transaction filter controls are present in the UI but are not applied to the table data yet.
- There is no authentication, authorisation, multi-user data isolation, or automated test suite.

## Technology

| Area | Tools |
| --- | --- |
| Web | React 19, TypeScript, Vite, Tailwind CSS, React Router |
| Client data | TanStack Query, React Hook Form, Zod, Recharts |
| API | Node.js, Hono, TypeScript, Zod |
| Database | PostgreSQL 17, Drizzle ORM, Drizzle Kit |
| Local infrastructure | Docker Compose |
| Repository layout | npm workspaces |

## Prerequisites

- Node.js 20 LTS or later (the project is currently verified with Node.js 24).
- npm 10 or later.
- Docker Engine with Docker Compose, for the local PostgreSQL service.

## Quick start

Run the following commands from the repository root.

1. Install workspace dependencies.

   ```bash
   npm install
   ```

2. Start PostgreSQL.

   ```bash
   docker compose up -d postgres
   ```

3. Create the API environment file and set its connection string.

   ```bash
   cp apps/api/.env.example apps/api/.env
   ```

   In `apps/api/.env`, set:

   ```env
   DATABASE_URL=postgresql://expense:expense@localhost:5432/expense_db
   ```

4. Create `apps/web/.env` with the API base URL. The trailing slash is required by the current client URL construction.

   ```env
   VITE_BASE_URL=http://localhost:3000/api/
   ```

5. Apply the committed database migrations.

   ```bash
   npm run db:migrate -w api
   ```

6. Start the API and web app in separate terminals.

   ```bash
   npm run dev:api
   ```

   ```bash
   npm run dev:web
   ```

The API listens on `http://localhost:3000`; Vite normally serves the web app at `http://localhost:5173`.

Verify that the API is running:

```bash
curl http://localhost:3000/api/health
```

Expected response:

```json
{
  "status": "ok",
  "message": "API is running"
}
```

To stop the local database while preserving its data:

```bash
docker compose down
```

## Configuration

| File | Variable | Required | Description |
| --- | --- | --- |
| `apps/api/.env` | `DATABASE_URL` | Yes | PostgreSQL connection string used by the API and Drizzle Kit. |
| `apps/web/.env` | `VITE_BASE_URL` | Yes | Browser-visible API base URL. It must end in `/`, for example `http://localhost:3000/api/`. |

`VITE_*` values are embedded in the client build. Never put passwords, API keys, or other secrets in them. The root `.gitignore` excludes `.env` files; use `apps/api/.env.example` as the API configuration template.

The API currently permits cross-origin requests only from `http://localhost:5173`. If the web app runs elsewhere, update the CORS origin in `apps/api/src/app.ts` deliberately rather than opening it to every origin.

## Available commands

| Command | Purpose |
| --- | --- |
| `npm run dev:api` | Run the API with file watching on port 3000. |
| `npm run dev:web` | Run the Vite development server. |
| `npm run build -w api` | Type-check and compile the API to `apps/api/dist`. |
| `npm run start -w api` | Run the compiled API. Build it first. |
| `npm run build -w web` | Type-check and create a production web build. |
| `npm run preview -w web` | Preview the web production build locally. |
| `npm run lint -w web` | Run the web ESLint configuration. |
| `npm run db:generate -w api` | Generate a Drizzle migration after a schema change. |
| `npm run db:migrate -w api` | Apply pending Drizzle migrations. |

## API reference

Base URL: `http://localhost:3000/api`

| Method | Path | Description | Success response |
| --- | --- | --- |
| `GET` | `/health` | Check API availability. | `200` |
| `GET` | `/dashboard` | Return this month's summary, daily income/expense data, and five latest transactions. | `200` |
| `GET` | `/transactions` | Return all transactions. | `200` |
| `GET` | `/transactions/:id` | Return one transaction by UUID. | `200` |
| `POST` | `/transactions` | Create a transaction. | `201` |
| `PATCH` | `/transactions/:id` | Update one or more transaction fields. | `200` |
| `DELETE` | `/transactions` | Delete a transaction; send its UUID as a JSON string in the request body. | `200` |

### Transaction payload

```json
{
  "title": "Groceries",
  "amount": 250000,
  "category": "Food",
  "type": "expense"
}
```

`title` and `category` must be non-empty strings. `type` must be `income` or `expense`. The creation form requires a positive amount; the API accepts a JSON number, so callers should also send a positive integer amount. Amounts are stored as PostgreSQL integers.

The API adds `id`, `createdAt`, and `updatedAt` to saved transactions. Invalid identifiers or payloads return `400`; a missing transaction returns `404`.

### cURL examples

Create a transaction:

```bash
curl --request POST http://localhost:3000/api/transactions \
  --header 'Content-Type: application/json' \
  --data '{"title":"Salary","amount":50000000,"category":"Work","type":"income"}'
```

Update a transaction:

```bash
curl --request PATCH http://localhost:3000/api/transactions/<transaction-id> \
  --header 'Content-Type: application/json' \
  --data '{"category":"Household"}'
```

Delete a transaction (the current API expects the ID in the JSON body):

```bash
curl --request DELETE http://localhost:3000/api/transactions \
  --header 'Content-Type: application/json' \
  --data '"<transaction-id>"'
```

## Data model and migrations

The `transactions` table contains the following fields:

| Column | Type | Notes |
| --- | --- | --- |
| `id` | UUID | Primary key generated by PostgreSQL. |
| `title` | `varchar(255)` | Transaction description. |
| `amount` | integer | Amount in the application's chosen smallest currency unit. |
| `category` | `varchar(150)` | Free-text category. |
| `type` | `varchar(40)` | `income` or `expense`. |
| `created_at` | timestamp | Set when the record is created. |
| `updated_at` | timestamp | Updated when the record changes. |

When changing the schema:

1. Update the Drizzle schema in `apps/api/src/db/schema/`.
2. Generate a migration with `npm run db:generate -w api`.
3. Review the SQL created under `apps/api/drizzle/` and commit it with the schema change.
4. Apply it locally with `npm run db:migrate -w api`.

Do not edit a migration that has already been applied in a shared environment. Create a new forward-only migration instead, and back up production data before applying it.

## Project structure

```text
.
├── apps/
│   ├── api/
│   │   ├── src/
│   │   │   ├── db/           # Drizzle connection and schema
│   │   │   ├── routes/       # Hono HTTP routes
│   │   │   ├── schemas/      # Request validation
│   │   │   └── services/     # Database operations and dashboard queries
│   │   └── drizzle/          # Versioned SQL migrations
│   └── web/
│       └── src/
│           ├── api/          # HTTP client functions
│           ├── components/   # Layout and UI components
│           ├── hooks/        # React Query hooks
│           ├── pages/        # Route-level screens
│           └── schemas/      # Client-side form validation
├── docker-compose.yml        # Local PostgreSQL service
└── package.json              # Workspace scripts and configuration
```

## Production and security notes

- The Docker Compose username and password are development defaults only. Replace them with unique, secret-managed credentials in any deployed environment.
- This project has no authentication or tenant isolation. Do not expose it publicly or use it for sensitive financial data until those controls, secure transport, rate limiting, logging, backups, and monitoring are in place.
- Restrict CORS to known front-end origins. Configure environment-specific values outside source control.
- Serve the API and database over private networks where possible; do not publish PostgreSQL's port unless it is required.
- Treat database migrations as deployment steps. Back up the database and test migrations against a representative copy before production use.

## Contributing

1. Create a focused branch from the current main branch.
2. Keep implementation, schema, and migration changes together when applicable.
3. Run the relevant build and lint commands before opening a pull request.
4. Describe user-visible changes, configuration changes, and any migration or rollback considerations in the pull request.

There is no license file in this repository yet. Obtain the maintainer's approval before redistributing or using the code outside the intended project context.
