import z from "zod";

export const createTransactionSchema = z.object({
  title: z.string().min(1),
  amount: z.number(),
  category: z.string().min(1),
  type: z.enum(["income", "expense"]),
});
export const transactionIdSchema = z.uuid();
