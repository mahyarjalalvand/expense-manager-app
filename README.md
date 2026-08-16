# Expense Manager

An expense-management application for recording and categorizing income and expense transactions, with a clear view of personal finances.

> **Project status:** This application is currently under development. Some features, user-interface elements, and APIs may change or are not complete yet.

## Current features

- Dashboard, transactions, categories, and settings views
- Create, read, update, and delete transactions through the API
- Transaction-data validation
- PostgreSQL data storage

## Tech stack

- Frontend: React, TypeScript, Vite, Tailwind CSS
- Backend: Node.js, Hono, TypeScript
- Database: PostgreSQL
- ORM and migrations: Drizzle ORM and Drizzle Kit
- Project structure: npm workspaces (monorepo)

## Prerequisites

- Node.js 20 or later
- npm
- Docker and Docker Compose (to run PostgreSQL)

## Getting started

### 1. Install dependencies

Run this from the project root:

```bash
npm install
```

### 2. Start the database

Start the PostgreSQL service with Docker:

```bash
docker compose up -d
```

The database starts with the following settings:

| Setting | Value |
| --- | --- |
| Host | `localhost` |
| Port | `5432` |
| Database | `expense_db` |
| Username | `expense` |
| Password | `expense` |

### 3. Configure API environment variables

Copy the example environment file:

```bash
cp apps/api/.env.example apps/api/.env
```

Then set the following value in `apps/api/.env`:

```env
DATABASE_URL=postgresql://expense:expense@localhost:5432/expense_db
```

### 4. Apply database migrations

```bash
npm run db:migrate -w api
```

### 5. Start the development environment

Run the API and client in separate terminals.

First terminal:

```bash
npm run dev:api
```

By default, the API runs at `http://localhost:3000`.

Second terminal:

```bash
npm run dev:web
```

Vite prints the frontend URL in the terminal; it is usually `http://localhost:5173`.

## Verify the API

Once the API is running, check its health endpoint:

```bash
curl http://localhost:3000/api/health
```

Example response:

```json
{
  "status": "ok",
  "message": "API is running"
}
```

## Available API endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Check API health |
| `GET` | `/api/transactions` | Retrieve all transactions |
| `GET` | `/api/transactions/:id` | Retrieve a transaction |
| `POST` | `/api/transactions` | Create a transaction |
| `PATCH` | `/api/transactions/:id` | Update a transaction |
| `DELETE` | `/api/transactions/:id` | Delete a transaction |

## Useful scripts

| Command | Description |
| --- | --- |
| `npm run dev:web` | Start the frontend in development mode |
| `npm run dev:api` | Start the API in development mode |
| `npm run build -w web` | Build the production frontend |
| `npm run lint -w web` | Run frontend linting |
| `npm run db:generate -w api` | Generate a migration from schema changes |
| `npm run db:migrate -w api` | Apply database migrations |

## Project structure

```text
.
├── apps/
│   ├── api/          # API and database logic
│   └── web/          # React frontend
├── docker-compose.yml
└── package.json
```
