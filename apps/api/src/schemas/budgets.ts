import z from "zod";

const budgetFieldsSchema = z.object({
  name: z.string().trim().min(1, "Budget name is required").max(100),
  amount: z.number().int("Amount must be an integer").positive("Amount must be greater than zero"),
});

export const createBudgetSchema = budgetFieldsSchema.extend({
  year: z.number().int().min(2000).max(2100),
  month: z.number().int().min(1).max(12),
  confirmIncomeMismatch: z.boolean().optional().default(false),
});

export const updateBudgetSchema = z
  .object({
    name: budgetFieldsSchema.shape.name.optional(),
    amount: budgetFieldsSchema.shape.amount.optional(),
    confirmIncomeMismatch: z.boolean().optional().default(false),
  })
  .refine((data) => data.name !== undefined || data.amount !== undefined, {
    message: "At least one field must be provided",
  });
export type CreateBudget = z.infer<typeof createBudgetSchema>;
export type UpdateBudget = z.infer<typeof updateBudgetSchema>;
