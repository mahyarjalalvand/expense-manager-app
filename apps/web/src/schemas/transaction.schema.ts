import { z } from "zod";

export const createTransactionsSchema = z.object({
  title: z.string().min(1, "Title is required"),
  amount: z.number().positive("Amount must be greater than 0"),
  category: z.string().min(1, "Category is required"),
  type: z.enum(["income", "expense"]),
});

export type CreateTransactionForm = z.infer<typeof createTransactionsSchema>;
