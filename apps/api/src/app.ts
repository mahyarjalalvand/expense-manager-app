import { Hono } from "hono";
import { cors } from "hono/cors";

import { auth } from "./auth.js";

import healthRoutes from "./routes/health.routes.js";
import transactionsRoutes from "./routes/transactions.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import { categoriesRoutes } from "./routes/categories.routes.js";

const app = new Hono();

app.use("/api/*", cors({ origin: "http://localhost:5173", credentials: true }));
app.all("/api/auth/*", (c) => auth.handler(c.req.raw));

app.route("/api/health", healthRoutes);
app.route("/api/dashboard", dashboardRoutes);
app.route("/api/transactions", transactionsRoutes);
app.route("/api/categories", categoriesRoutes);

export default app;
