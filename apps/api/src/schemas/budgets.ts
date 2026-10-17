import z from "zod";

export const createBudgetSchema = z.object({
  name: z.string().trim().min(1, "Budget name is required").max(100),
  amount: z.number().int("Amount must be an integer").positive("Amount must be greater than zero"),
  year: z.number().int().min(2000).max(2100),
  month: z.number().int().min(1).max(12),
  confirmIncomeMismatch: z.boolean().optional().default(false),
});

export type CreateBudget = z.infer<typeof createBudgetSchema>;
