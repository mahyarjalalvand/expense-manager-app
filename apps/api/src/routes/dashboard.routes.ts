import { Hono } from "hono";

const dashboardRoutes = new Hono();

dashboardRoutes.get("/", async () => {});

export default dashboardRoutes;
