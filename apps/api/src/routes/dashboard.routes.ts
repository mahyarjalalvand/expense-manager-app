import { Hono } from "hono";
import { getDashboard } from "../services/dashboard.service.js";

const dashboardRoutes = new Hono();

dashboardRoutes.get("/", async (c) => {
  const result = await getDashboard();
  return c.json(result);
});
export default dashboardRoutes;
