import { Hono } from "hono";
import healthRoutes from "./routes/health.routes.js";
import transactionsRoutes from "./routes/transactions.routes.js";
import { cors } from "hono/cors";
import dashboardRoutes from "./routes/dashboard.routes.js";

const app = new Hono();

app.use("/api/*", cors({ origin: "http://localhost:5173" }));

app.route("/api/health", healthRoutes);
app.route("/api/dashboard", dashboardRoutes);
app.route("/api/transactions", transactionsRoutes);

export default app;
