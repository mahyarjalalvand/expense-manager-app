import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/api/health", (c) => {
  return c.json({ status: "ok", message: "apis" });
});

app.get("/api/transactions/:id", (c) => {
  const id = c.req.param("id");
  return c.json({
    id,
    message: "transaction found",
  });
});
app.get("/api/transactions", (c) => {
  const { type, category } = c.req.query();
  return c.json({
    type,
    category,
  });
});

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
