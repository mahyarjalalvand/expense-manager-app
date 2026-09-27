# Expense Manager API

The API is a TypeScript service built with Hono. It provides Better Auth endpoints, user-scoped categories and transactions, and dashboard aggregates backed by PostgreSQL and Drizzle ORM.

Return to the [project README](../../README.md) for complete local setup.

## Layout

~~~text
src/
├── app.ts                   # Hono app, CORS, routes, and error handler
├── auth.ts                  # Better Auth configuration and default-category hook
├── db/schema/               # Drizzle tables
├── middlewares/auth.ts      # Session guard
├── routes/                  # HTTP route definitions
├── schemas/                 # Zod request validation
└── services/                # Database queries and dashboard aggregation

drizzle/                     # Versioned SQL migrations and metadata
~~~

## Run

From the repository root, create apps/api/.env:

~~~env
DATABASE_URL=postgresql://expense:expense@localhost:5432/expense_db
~~~

Then start PostgreSQL, apply migrations, and run the API:

~~~bash
docker compose up -d postgres
npm run db:migrate -w api
npm run dev:api
~~~

The service listens on http://localhost:3000. In development, it permits credentialed browser requests only from http://localhost:5173.

## Scripts

| Command | Description |
| --- | --- |
| npm run dev -w api | Start the API with tsx watch and load .env. |
| npm run build -w api | Compile TypeScript to dist/. |
| npm run start -w api | Run dist/index.js. |
| npm run db:generate -w api | Generate a new Drizzle migration. |
| npm run db:migrate -w api | Apply pending migrations. |
| npm run db:studio -w api | Launch Drizzle Studio. |

## HTTP API

Base URL: http://localhost:3000/api

| Access | Method | Path | Description |
| --- | --- | --- | --- |
| Public | GET | /health | Returns API status. |
| Public | ALL | /auth/* | Better Auth handler for email/password signup, sign-in, session, and sign-out. |
| Authenticated | GET | /dashboard?range=30d | User-scoped summary, daily values, and five recent transactions. |
| Authenticated | GET | /transactions?page=1&limit=10&type=all | Paginated transactions for the current user. |
| Authenticated | GET | /transactions/:id | A transaction owned by the current user. |
| Authenticated | POST | /transactions | Create a transaction. |
| Authenticated | PATCH | /transactions/:id | Update a transaction. |
| Authenticated | DELETE | /transactions | Delete a transaction; its UUID is a JSON string request body. |
| Authenticated | GET | /categories | List the current user's categories. |
| Authenticated | POST | /categories | Create a category. |
| Authenticated | PATCH | /categories/:id | Update a category. |
| Authenticated | DELETE | /categories/:id | Delete an unused category. |

Protected endpoints obtain the session from the Better Auth cookie. Direct callers must include their own valid session cookie.

## Request validation

| Resource | Required fields | Optional or constrained fields |
| --- | --- | --- |
| Create transaction | title, numeric amount, categoryId, type | type is income or expense; categoryId must belong to the signed-in user. |
| Update transaction | — | Any subset of the create-transaction fields. |
| Create category | name | icon, color |
| Update category | — | Any subset of name, icon, color; a provided name cannot be empty. |
| Transaction list | — | page and limit are positive integers (defaults: 1, 10); type is all, income, or expense. |
| Dashboard | range | One of 7d, 30d, month, or year. |

Example authenticated request:

~~~bash
curl --request POST http://localhost:3000/api/transactions \
  --header 'Content-Type: application/json' \
  --cookie 'better-auth.session_token=<session-token>' \
  --data '{"title":"Groceries","amount":250000,"categoryId":"<category-id>","type":"expense"}'
~~~

Validation errors return 400; missing or invalid sessions return 401; missing resources return 404; deleting a category with transactions returns 409.

## Data model

Better Auth owns user, session, account, and verification. The application tables are:

| Table | Key fields | Notes |
| --- | --- | --- |
| categories | id, user_id, name, icon, color | Belongs to a user and is deleted with that user. |
| transactions | id, user_id, category_id, title, amount, type | Belongs to a user and category. The category reference is restricted while transactions exist. |

Both application tables include created_at and updated_at. Amounts are PostgreSQL integers; choose and consistently use a smallest currency unit in clients.

After a user is created, the Better Auth database hook creates eight default categories: Food, Transport, Shopping, Bills, Entertainment, Salary, Freelance, and Other Income.

## Migrations and deployment notes

Update src/db/schema/, generate a migration, review the SQL in drizzle/, and apply it with npm run db:migrate -w api. Never rewrite a migration used by a shared environment.

For deployment, replace development database credentials, configure a Better Auth secret and trusted origins, serve over HTTPS, tighten CORS, and add rate limiting, monitoring, backups, and tests.
