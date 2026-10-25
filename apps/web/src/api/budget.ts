import type { Budget, CreateBudget, MonthlyBudget } from "@/types/budgets";
import { api } from "@/utils/api";

export const getMonthlyBudget = async (year: number, month: number): Promise<MonthlyBudget> => {
  const res = await api(`budgets/${year}/${month}`);
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Feailed to fetch budget");
  }
  return res.json();
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
    const data = await res.json();
    throw new Error(data.message || "Failed to create budget");
  }
  return res.json();
};

export const deleteBudget = async (year: number, month: number) => {
  const res = await api(`budgets/${year}/${month}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const data = res.json();
    throw new Error(data.message || "Failed to delete Budget");
  }
  return res.json();
};
