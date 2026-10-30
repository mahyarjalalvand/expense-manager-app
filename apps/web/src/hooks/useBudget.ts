import { createBudget, deleteBudget, getMonthlyBudget, updateBudget } from "@/api/budget";
import type { BudgetFormValues } from "@/schemas/budget";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const budgetQueryKey = ["budget"];
export type BudgetMutationValues = BudgetFormValues & {
  confirmIncomeMismatch?: boolean;
};

export const useGetBudget = (year: number, month: number) => {
  return useQuery({
    queryKey: [...budgetQueryKey, year, month],
    queryFn: () => getMonthlyBudget(year, month),
  });
};

export const useCreateBudget = (year: number, month: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: BudgetMutationValues) =>
      createBudget({
        ...values,
        year,
        month,
      }),

    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [...budgetQueryKey, year, month],
      }),
  });
};

export const useUpdateBudget = (year: number, month: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: BudgetMutationValues) => updateBudget(year, month, values),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...budgetQueryKey, year, month],
      });
    },
  });
};

export const useDeleteBudget = (year: number, month: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteBudget(year, month),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...budgetQueryKey, year, month],
      });
    },
  });
};
