import z from "zod";

export const createTransactionSchema = z.object({
  title: z.string().min(1),
  amount: z.number(),
  categoryId: z.string().min(1),
  type: z.enum(["income", "expense"]),
});
export const transactionIdSchema = z.uuid();

export const updateTransactionSchema = createTransactionSchema.partial();

export const transactionsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).default(10),
  type: z.enum(["all", "expense", "income"]).default("all"),
});
