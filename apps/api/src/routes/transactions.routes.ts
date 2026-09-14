import { Hono } from "hono";

import { createTransactionSchema, transactionIdSchema, transactionsQuerySchema, updateTransactionSchema } from "../schemas/transactions.js";
import { createTransaction, deleteTransaction, getTransactionById, getTransactions, updateTransaction } from "../services/transactions.service.js";
import { authMiddleware } from "../middlewares/auth.js";

const transactionsRoutes = new Hono();

transactionsRoutes.get("/", authMiddleware, async (c) => {
  const user = c.get("user");
  const parsed = transactionsQuerySchema.safeParse({
    page: c.req.query("page"),
    limit: c.req.query("limit"),
    type: c.req.query("type"),
  });

  if (!parsed.success) {
    return c.json({ message: "Invalid query parameters", error: parsed.error.issues }, 400);
  }

  const { limit, page, type } = parsed.data;
  const result = await getTransactions(page, limit, type, user.id);
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

transactionsRoutes.post("/", authMiddleware, async (c) => {
  const user = c.get("user");

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

  const result = await createTransaction(parsed.data, user.id);
  return c.json(result, 201);
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
  const body = await c.req.json();
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

  const transaction = await updateTransaction(parsedBody.data, parsedId.data);
  if (!transaction) {
    return c.json({ message: "Transaction not found" }, 404);
  }

  return c.json(transaction);
});

transactionsRoutes.delete("/", async (c) => {
  const id = await c.req.json();
  const parsedId = transactionIdSchema.safeParse(id);
  if (!parsedId.success) {
    return c.json(
      {
        message: "Invalid transaction id",
      },
      400,
    );
  }

  const transaction = await deleteTransaction(parsedId.data);
  if (!transaction) {
    return c.json({ message: "Transaction not found" }, 404);
  }
  return c.json(transaction);
});

export default transactionsRoutes;
