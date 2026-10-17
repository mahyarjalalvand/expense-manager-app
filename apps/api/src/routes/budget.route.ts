import { Hono } from "hono";
import { authMiddleware } from "../middlewares/auth.js";
import { createBudgetSchema } from "../schemas/budgets.js";
import { createBudget } from "../services/budget.service.js";

export const budgetsRoutes = new Hono();

budgetsRoutes.post("/", authMiddleware, async (c) => {
  const user = c.get("user");
  const body = await c.req.json();

  const parsed = createBudgetSchema.safeParse(body);

  if (!parsed.success) {
    return c.json(
      {
        message: "Invalid budget data",
        errors: parsed.error.issues,
      },
      400,
    );
  }

  const result = await createBudget(user.id, parsed.data, parsed.data.confirmIncomeMismatch);

  if (!result.success) {
    if (result.reason === "BUDGET_ALREADY_EXISTS") {
      return c.json({ message: "A budget already exists for this month" }, 409);
    }

    if (result.reason === "BUDGET_EXCEEDS_INCOME") {
      return c.json(
        {
          code: result.reason,
          message: "Budget exceeds the recorded income for this month",
          budgetAmount: result.budgetAmount,
          monthlyIncome: result.monthlyIncome,
        },
        409,
      );
    }
  }
  return c.json(result.budget, 201);
});
