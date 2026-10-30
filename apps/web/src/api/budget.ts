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

export const createBudget = async (data: CreateBudget): Promise<Budget> => {
  const res = await api("budgets", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const resData = await res.json().catch(() => null);
  if (!res.ok) {
    const error = new Error(resData.message || "Failed to create budget");
    Object.assign(error, resData);

    throw error;
  }

  return resData;
};

export const updateBudget = async (year: number, month: number, values: BudgetFormValues) => {
  const res = await api(`budgets/${year}/${month}`, {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(values),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const error = new Error(data.message || "Failed to update budget");
    Object.assign(error, data);
    throw error;
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
