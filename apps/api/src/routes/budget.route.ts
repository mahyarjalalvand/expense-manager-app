import { Hono } from "hono";
import { authMiddleware } from "../middlewares/auth.js";
import { createBudgetSchema } from "../schemas/budgets.js";
import { createBudget, getMonthlyBudgetResult } from "../services/budget.service.js";

export const budgetsRoutes = new Hono();

budgetsRoutes.get("/:year/:month", authMiddleware, async (c) => {
  const user = c.get("user");
  const year = Number(c.req.param("year"));
  const month = Number(c.req.param("month"));

  if (!Number.isInteger(year) || year < 2000 || year > 2100 || !Number.isInteger(month) || month < 1 || month > 12) {
    return c.json({ message: "Invalid year or month" }, 400);
  }

  const result = await getMonthlyBudgetResult(user.id, year, month);
  if (!result.success) {
    return c.json({ message: "Budget not found for this month" }, 404);
  }

  return c.json({
    ...result.budget,
    spent: result.spent,
    remaining: result.remaining,
    percentageUsed: result.percentageUsed,
  });
});

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
