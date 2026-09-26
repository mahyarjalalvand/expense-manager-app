# Expense Manager

English | [فارسی](README.fa.md)

A full-stack personal-finance application built as an npm-workspaces monorepo with a React client, Hono API, and PostgreSQL database.

> **Status:** authentication, categories, transactions, and the dashboard are implemented. Settings, transaction editing in the web UI, automated tests, and production hardening are still in progress.

## Features

- Email/password registration and sign-in through Better Auth.
- Protected web routes with user-scoped transactions and categories.
- Create, filter, paginate, and delete transactions from the web UI.
- Create, edit, and delete categories; each new account receives eight default categories.
- Dashboard totals, a daily income/expense chart, and five recent transactions for `7d`, `30d`, `month`, or `year`.
- Zod validation and PostgreSQL persistence through versioned Drizzle migrations.

## Stack

| Area | Tools |
| --- | --- |
| Web | React 19, TypeScript, Vite, Tailwind CSS, React Router |
| Client data | TanStack Query, React Hook Form, Zod, Recharts |
| API | Node.js, Hono, TypeScript, Better Auth, Zod |
| Database | PostgreSQL 17, Drizzle ORM, Drizzle Kit |
| Local infrastructure | Docker Compose |

## Run locally

Prerequisites: Node.js 20 LTS or later, npm 10 or later, and Docker Compose.

Run the following from the repository root.

1. Install dependencies.

   ```bash
   npm install
   ```

2. Start PostgreSQL.

   ```bash
   docker compose up -d postgres
   ```

3. Create `apps/api/.env`.

   ```bash
   cp apps/api/.env.example apps/api/.env
   ```

   ```env
   DATABASE_URL=postgresql://expense:expense@localhost:5432/expense_db
   ```

4. Create `apps/web/.env`. The trailing slash is required.

   ```env
   VITE_BASE_URL=http://localhost:3000/api/
   ```

5. Apply migrations and start each application in a separate terminal.

   ```bash
   npm run db:migrate -w api
   npm run dev:api
   ```

   ```bash
   npm run dev:web
   ```

The API runs on `http://localhost:3000` and the web app normally runs on `http://localhost:5173`. Create an account at `/register` before signing in.

Check the API:

```bash
curl http://localhost:3000/api/health
```

Stop PostgreSQL without deleting its volume:

```bash
docker compose down
```

## Configuration and commands

| File | Variable | Description |
| --- | --- | --- |
| `apps/api/.env` | `DATABASE_URL` | PostgreSQL connection string for the API, Better Auth, and Drizzle Kit. |
| `apps/web/.env` | `VITE_BASE_URL` | Browser-visible API base URL ending in `/`. |

`VITE_*` variables are included in the browser build, so do not put secrets in them. If the client is hosted somewhere other than `http://localhost:5173`, update both the CORS origin in `apps/api/src/app.ts` and Better Auth's `trustedOrigins` in `apps/api/src/auth.ts`.

| Command | Purpose |
| --- | --- |
| `npm run dev:api` / `npm run dev:web` | Start the API or web development server. |
| `npm run build -w api` / `npm run build -w web` | Build an individual workspace. |
| `npm run start -w api` | Run the built API. |
| `npm run lint -w web` | Lint the web workspace. |
| `npm run db:generate -w api` | Generate a migration after a schema change. |
| `npm run db:migrate -w api` | Apply pending migrations. |
| `npm run db:studio -w api` | Open Drizzle Studio. |

## API

Base URL: `http://localhost:3000/api`

| Access | Method | Path | Description |
| --- | --- | --- | --- |
| Public | `GET` | `/health` | API health check. |
| Public | `GET` | `/dashboard?range=30d` | Summary, daily data, and five recent transactions. `range` is required: `7d`, `30d`, `month`, or `year`. |
| Public | `ALL` | `/auth/*` | Better Auth handler for registration, login, session, and logout flows. |
| Authenticated | `GET` | `/transactions?page=1&limit=10&type=all` | Current user's transactions. `type` is `all`, `income`, or `expense`. |
| Authenticated | `GET` | `/transactions/:id` | A transaction owned by the current user. |
| Authenticated | `POST` | `/transactions` | Create a transaction. |
| Authenticated | `PATCH` | `/transactions/:id` | Update transaction fields. |
| Authenticated | `DELETE` | `/transactions` | Delete a transaction; pass its UUID as a JSON string in the body. |
| Authenticated | `GET` / `POST` | `/categories` | List or create the current user's categories. |
| Authenticated | `PATCH` / `DELETE` | `/categories/:id` | Update a category or delete one with no transactions. |

The web client automatically sends the Better Auth session cookie. For direct calls, send that cookie yourself.

```bash
curl --request POST http://localhost:3000/api/transactions \
  --header 'Content-Type: application/json' \
  --cookie 'better-auth.session_token=<session-token>' \
  --data '{"title":"Groceries","amount":250000,"categoryId":"<category-id>","type":"expense"}'
```

A transaction requires a non-empty `title`, numeric `amount`, `categoryId`, and `type` of `income` or `expense`. A category requires a non-empty `name`; `icon` and `color` are optional. Validation errors return `400`, protected requests without a session return `401`, missing records return `404`, and deleting an in-use category returns `409`.

## Data and migrations

Better Auth manages users, sessions, accounts, and verification records. Application tables are:

| Table | Key fields | Notes |
| --- | --- | --- |
| `categories` | `id`, `user_id`, `name`, `icon`, `color` | Personal categories, deleted with their user. |
| `transactions` | `id`, `user_id`, `category_id`, `title`, `amount`, `type` | A transaction belongs to a user and category; its category cannot be deleted while in use. |

Both tables have `created_at` and `updated_at` timestamps. Amounts are PostgreSQL integers; use one consistent smallest currency unit.

For a schema change, update `apps/api/src/db/schema/`, run `npm run db:generate -w api`, review and commit the SQL in `apps/api/drizzle/`, then run `npm run db:migrate -w api`. Never alter a migration already used in a shared environment—create a forward-only migration instead.

## Security notes

- The Compose database credentials are development defaults only; use unique, secret-managed credentials elsewhere.
- The dashboard endpoint is public and its data is not scoped to the signed-in user. Do not expose the application or use real financial data until it is protected and user-scoped.
- Before production use, configure a Better Auth secret and trusted origins, enable HTTPS, restrict CORS, and add rate limiting, monitoring, backups, and automated tests.
