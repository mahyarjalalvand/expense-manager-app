import { Hono } from "hono";
import { getDashboard } from "../services/dashboard.service.js";
import { dateRangeSchema } from "../schemas/dateRange.js";

const dashboardRoutes = new Hono();

dashboardRoutes.get("/", async (c) => {
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
  const result = await getDashboard(parsedRange.data);
  return c.json(result);
});
export default dashboardRoutes;
