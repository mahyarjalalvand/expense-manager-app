import { Hono } from "hono";
import type { Transaction } from "../types/transaction.js";

import { eq } from "drizzle-orm";
import { createTransactionSchema, transactionIdSchema, updateTransactionSchema } from "../schemas/transactions.js";
import { getTransactionById, getTransactions } from "../services/transactions.service.js";

const transactionsRoutes = new Hono();

transactionsRoutes.get("/", async (c) => {
  const result = await getTransactions();
  return c.json(result);
});

transactionsRoutes.get("/:id", async (c) => {
  const id = c.req.param("id");

  const parsed = transactionIdSchema.safeParse(id);
  if (!parsed.success) {
    return c.json(
      {
        message: "Invalid transaction id",
      },
      400,
    );
  }

  const transaction = await getTransactionById(parsed.data);
  if (!transaction) {
    return c.json({ message: "Transaction not found" }, 404);
  }

  return c.json(transaction);
});

transactionsRoutes.post("/", async (c) => {
  const body = await c.req.json();
  const parsed = createTransactionSchema.safeParse(body);

  if (!parsed.success) {
    return c.json(
      {
        message: "Invalid transaction data",
        errors: parsed.error.issues,
      },
      400,
    );
  }

  const result = await db
    .insert(transactions)
    .values({
      title: parsed.data.title,
      amount: parsed.data.amount,
      category: parsed.data.category,
      type: parsed.data.type,
    })
    .returning();

  return c.json(result[0], 201);
});

transactionsRoutes.patch("/:id", async (c) => {
  const id = c.req.param("id");
  const parsedId = transactionIdSchema.safeParse(id);

  if (!parsedId.success) {
    return c.json(
      {
        message: "Invalid Transaction id",
      },
      400,
    );
  }
  const body = await c.req.json<Partial<Transaction>>();
  const parsedBody = updateTransactionSchema.safeParse(body);

  if (!parsedBody.success) {
    return c.json(
      {
        message: "Invalid transaction data",
        errors: parsedBody.error.issues,
      },
      400,
    );
  }

  const result = await db
    .update(transactions)
    .set({ ...parsedBody.data, updatedAt: new Date() })
    .where(eq(transactions.id, parsedId.data))
    .returning();
  const transaction = result[0];
  if (!transaction) {
    return c.json({ message: "Transaction not found" }, 404);
  }

  return c.json(transaction);
});

transactionsRoutes.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const parsedId = transactionIdSchema.safeParse(id);
  if (!parsedId.success) {
    return c.json(
      {
        message: "Invalid transaction id",
      },
      400,
    );
  }

  const result = await db.delete(transactions).where(eq(transactions.id, parsedId.data)).returning();
  const transaction = result[0];
  if (!transaction) {
    return c.json({ message: "Transaction not found" }, 404);
  }
  return c.json(transaction);
});

export default transactionsRoutes;
