import type { BudgetFormValues } from "@/schemas/budget";
import type { Budget, CreateBudget, MonthlyBudget } from "@/types/budgets";
import { api } from "@/utils/api";

export const getMonthlyBudget = async (year: number, month: number): Promise<MonthlyBudget | null> => {
  const res = await api(`budgets/${year}/${month}`);
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    if (res.status === 404 && data?.code === "BUDGET_NOT_FOUND") {
      return null;
    }

    throw new Error(data?.message || "Failed to fetch budget");
  }

  return data as MonthlyBudget;
};

type BudgetApiError = Error & {
  code?: string;
  budgetAmount?: number;
  monthlyIncome?: number;
};

export const createBudget = async (data: CreateBudget): Promise<Budget> => {
  const res = await api("budgets", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();

    const error = new Error(errorData.message || "Failed to create budget") as BudgetApiError;

    error.code = errorData.code;
    error.budgetAmount = errorData.budgetAmount;
    error.monthlyIncome = errorData.monthlyIncome;

    throw error;
  }

  return res.json();
};

export const updateBudget = async (year: number, month: number, values: BudgetFormValues) => {
  const res = await api(`/budgets/${year}/${month}`, {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(values),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data.message || "Failed to update budget");
  }
  return data;
};

export const deleteBudget = async (year: number, month: number) => {
  const res = await api(`budgets/${year}/${month}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Failed to delete Budget");
  }
  return res.json();
};
