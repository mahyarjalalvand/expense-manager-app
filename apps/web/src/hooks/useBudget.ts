import { getMonthlyBudget } from "@/api/budget";
import { useQuery } from "@tanstack/react-query";

export const budgetQueryKey = ["budget"];

export const useGetBudget = (year: number, month: number) => {
  return useQuery({
    queryKey: [...budgetQueryKey, year, month],
    queryFn: () => getMonthlyBudget(year, month),
  });
};
