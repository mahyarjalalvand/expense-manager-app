import z from "zod";

export const budgetFormSchema = z.object({
  name: z.string().trim().min(1, "Budget name is required").max(100),
  amount: z.number().int().positive("Amount must be greated than zero"),
});

export type BudgetFormValues = z.infer<typeof budgetFormSchema>;
