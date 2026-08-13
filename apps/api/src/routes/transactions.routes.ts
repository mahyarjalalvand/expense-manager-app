import { Hono } from "hono";
import type { Transaction } from "../types/transaction.js";

const transactionsRoutes = new Hono();

transactionsRoutes.get("/", (c) => {
  const { type, category } = c.req.query();
  return c.json({
    type,
    category,
  });
});

transactionsRoutes.get(":id", (c) => {
  const id = c.req.param("id");
  return c.json({
    id,
    message: "transaction found",
  });
});

transactionsRoutes.post("/", async (c) => {
  const body = await c.req.json<Transaction>();

  return c.json(body, 201);
});

export default transactionsRoutes;
