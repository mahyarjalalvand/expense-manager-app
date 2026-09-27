# Expense Manager Web

The web workspace is a React 19 single-page application built with Vite. It uses Better Auth's React client for sessions and communicates with the API through credentialed requests.

Return to the [project README](../../README.md) for complete local setup.

## Features and routes

| Route | Access | Purpose |
| --- | --- | --- |
| /register | Public | Create an email/password account. |
| /login | Public | Sign in with an existing account. |
| / | Authenticated | Dashboard with range-based aggregates, chart, and recent transactions. |
| /transactions | Authenticated | Create, filter, paginate, and delete transactions. |
| /categories | Authenticated | Create, edit, and delete categories. |
| /settings | Authenticated | Placeholder page. |

The client currently has no transaction-editing screen, although the API supports transaction updates.

## Layout

~~~text
src/
├── api/                     # Fetch functions for API resources
├── components/              # Layout, dialogs, tables, charts, and UI primitives
├── hooks/                   # TanStack Query data hooks and session hook
├── pages/                   # Route-level screens
├── schemas/                 # Form validation schemas
├── lib/                     # Better Auth client and QueryClient
└── routes/                  # Route constants and navigation metadata
~~~

## Run

Create apps/web/.env:

~~~env
VITE_BASE_URL=http://localhost:3000/api/
~~~

The trailing slash is required. VITE_BASE_URL is public build-time configuration; do not put credentials or secrets in it. The configured API must permit the web app's origin and allow credentials. The local API is configured for http://localhost:5173.

From the repository root:

~~~bash
npm run dev:web
~~~

Vite normally starts at http://localhost:5173. The API must be running and migrated before registration, login, or data screens can work.

## Scripts

| Command | Description |
| --- | --- |
| npm run dev -w web | Start the Vite development server. |
| npm run build -w web | Run TypeScript project builds and create a production bundle. |
| npm run lint -w web | Lint the workspace. |
| npm run preview -w web | Serve the built bundle locally. |

## Implementation notes

- React Router protects application pages through AuthGuard; unauthenticated visitors are sent to /login.
- TanStack Query caches categories, transactions, and dashboard responses, and invalidates relevant lists after mutations.
- Requests use credentials: include so the Better Auth session cookie is sent to the API.
- The UI uses Tailwind CSS, shadcn/Base UI primitives, Lucide icons, and Recharts.
- The @/ import alias resolves to src/.
