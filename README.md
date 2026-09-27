# Expense Manager

English | [فارسی](README.fa.md)

Expense Manager is a personal-finance application for recording income and expenses. It is an npm-workspaces monorepo with a React web client, a Hono API, and PostgreSQL persistence.

## Current capabilities

- Email/password registration and sign-in with Better Auth.
- Authenticated, user-scoped dashboard with income, expenses, balance, daily data, and five recent transactions.
- Transaction creation, filtering, pagination, and deletion in the web UI.
- Category creation, editing, and deletion; new accounts receive eight starter categories.
- Transaction-update support in the API; transaction editing is not yet exposed by the web UI.
- Zod validation and versioned Drizzle migrations.

Settings is a placeholder route. Automated tests and production deployment configuration are not present yet.

## Project structure

~~~text
apps/
├── api/                 # Hono API, Better Auth, Drizzle schema and migrations
└── web/                 # React + Vite single-page application

docker-compose.yml       # Local PostgreSQL 17 service
package.json             # npm workspace scripts
README.md                # English project guide
README.fa.md             # Persian project guide
~~~

See the [API documentation](apps/api/README.md) and [web documentation](apps/web/README.md) for workspace-level details.

## Technology

| Area | Tools |
| --- | --- |
| Web | React 19, TypeScript, Vite, Tailwind CSS, React Router |
| Client state | TanStack Query, React Hook Form, Zod, Recharts |
| API | Node.js, Hono, Better Auth, Zod |
| Database | PostgreSQL 17, Drizzle ORM, Drizzle Kit |
| Local services | Docker Compose |

## Run locally

Prerequisites: Node.js 20.6+ (or a current Node 20 LTS release), npm 10+, and Docker Compose.

Run the following from the repository root.

1. Install all workspace dependencies.

   ~~~bash
   npm install
   ~~~

2. Create apps/api/.env from the example and configure PostgreSQL.

   ~~~bash
   cp apps/api/.env.example apps/api/.env
   ~~~

   ~~~env
   DATABASE_URL=postgresql://expense:expense@localhost:5432/expense_db
   ~~~

3. Create apps/web/.env. The ending slash is required because the client appends route paths to this value.

   ~~~env
   VITE_BASE_URL=http://localhost:3000/api/
   ~~~

4. Start PostgreSQL and apply the checked-in migrations.

   ~~~bash
   docker compose up -d postgres
   npm run db:migrate -w api
   ~~~

5. Start the API and web app in separate terminals.

   ~~~bash
   npm run dev:api
   ~~~

   ~~~bash
   npm run dev:web
   ~~~

The API listens on http://localhost:3000; Vite normally serves the web app at http://localhost:5173. Register at http://localhost:5173/register, then sign in.

Verify the public health endpoint:

~~~bash
curl http://localhost:3000/api/health
~~~

Stop PostgreSQL without deleting its Docker volume:

~~~bash
docker compose down
~~~

## Commands

| Command | Description |
| --- | --- |
| npm run dev:api | Start the API in watch mode. |
| npm run dev:web | Start the Vite development server. |
| npm run build -w api | Compile the API to apps/api/dist. |
| npm run start -w api | Run the compiled API. |
| npm run build -w web | Type-check and create a production web build. |
| npm run lint -w web | Lint the web workspace. |
| npm run db:generate -w api | Generate a migration after a schema change. |
| npm run db:migrate -w api | Apply pending Drizzle migrations. |
| npm run db:studio -w api | Open Drizzle Studio. |

## Configuration and security

| File | Variable | Purpose |
| --- | --- | --- |
| apps/api/.env | DATABASE_URL | PostgreSQL URL used by the API, Better Auth, and Drizzle Kit. |
| apps/web/.env | VITE_BASE_URL | Browser-visible API base URL, ending in /. |

VITE_* values are embedded in the browser bundle, so they must not contain secrets. The API currently allows requests only from http://localhost:5173, and Better Auth trusts that same origin. When deploying the web app elsewhere, update both apps/api/src/app.ts and apps/api/src/auth.ts deliberately. Before handling real financial data in production, use distinct database credentials, HTTPS, restrictive CORS, a Better Auth secret, rate limiting, monitoring, backups, and tests.

## Database migrations

The application schema lives in apps/api/src/db/schema/; generated SQL migrations live in apps/api/drizzle/. For a schema change:

1. Update the Drizzle schema.
2. Run npm run db:generate -w api.
3. Review and commit the generated migration.
4. Run npm run db:migrate -w api locally and in each target environment.

Do not edit a migration that has already been applied in a shared environment; create a forward-only migration instead.
