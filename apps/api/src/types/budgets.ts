import type { budgets } from "../db/schema/budgets.js";

export type CreateBudgetResult =
  | {
      success: true;
      budget: typeof budgets.$inferSelect;
    }
  | {
      success: false;
      reason: "BUDGET_ALREADY_EXISTS";
    }
  | {
      success: false;
      reason: "BUDGET_EXCEEDS_INCOME";
      budgetAmount: number;
      monthlyIncome: number;
    };

export type GetMonthlyBudgetResult =
  | {
      success: true;
      budget: typeof budgets.$inferSelect;
      spent: number;
      remaining: number;
      percentageUsed: number;
    }
  | {
      success: false;
      reason: "BUDGET_NOT_FOUND";
    };

export type UpdateBudgetResult =
  | {
      success: true;
      budget: typeof budgets.$inferSelect;
    }
  | {
      success: false;
      reason: "BUDGET_EXCEEDS_INCOME";
      budgetAmount: number;
      monthlyIncome: number;
    }
  | {
      success: false;
      reason: "BUDGET_NOT_FOUND";
    };

export type DeleteBudgetResult =
  | {
      success: true;
    }
  | {
      success: false;
      reason: "BUDGET_NOT_FOUND";
    };
