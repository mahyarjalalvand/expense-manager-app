import type { MonthlyBudget } from "@/types/budgets";
import { api } from "@/utils/api";

export const getMonthlyBudget = async (year: number, month: number): Promise<MonthlyBudget> => {
  const res = await api(`/budget/${year}/${month}`);
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Feailed to fetch budget");
  }
  return res.json();
};
