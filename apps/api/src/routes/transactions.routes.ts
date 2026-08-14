import { Hono } from "hono";
import type { Transaction } from "../types/transaction.js";
import { db } from "../db/index.js";
import { transactions } from "../db/schema/transactions.js";
import { eq } from "drizzle-orm";

const transactionsRoutes = new Hono();

transactionsRoutes.get("/", async (c) => {
  const result = await db.select().from(transactions);
  return c.json(result);
});

transactionsRoutes.get("/:id", async (c) => {
  const id = c.req.param("id");
  const result = await db.select().from(transactions).where(eq(transactions.id, id));

  return c.json(result[0]);
});

transactionsRoutes.post("/", async (c) => {
  const body = await c.req.json<Transaction>();

  const result = await db
    .insert(transactions)
    .values({
      title: body.title,
      amount: body.amount,
      category: body.category,
      type: body.type,
    })
    .returning();

  return c.json(result[0], 201);
});

export default transactionsRoutes;
