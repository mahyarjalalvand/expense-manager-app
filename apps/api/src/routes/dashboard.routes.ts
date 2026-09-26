import { Hono } from "hono";
import { getDashboard } from "../services/dashboard.service.js";
import { dateRangeSchema } from "../schemas/dateRange.js";
import { authMiddleware } from "../middlewares/auth.js";

const dashboardRoutes = new Hono();

dashboardRoutes.get("/", authMiddleware, async (c) => {
  const user = c.get("user");
  const range = c.req.query("range");
  const parsedRange = dateRangeSchema.safeParse(range);
  if (!parsedRange.success) {
    return c.json(
      {
        message: "invalid date range",
      },
      400,
    );
  }
  const result = await getDashboard(parsedRange.data, user.id);
  return c.json(result);
});
export default dashboardRoutes;
