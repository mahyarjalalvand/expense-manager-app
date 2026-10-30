import { createBudget, deleteBudget, getMonthlyBudget, updateBudget } from "@/api/budget";
import type { BudgetFormValues } from "@/schemas/budget";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const budgetQueryKey = ["budget"];

export const useGetBudget = (year: number, month: number) => {
  return useQuery({
    queryKey: [...budgetQueryKey, year, month],
    queryFn: () => getMonthlyBudget(year, month),
  });
};

export const useCreateBudget = (year: number, month: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: BudgetFormValues) =>
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
    mutationFn: (values: BudgetFormValues) => updateBudget(year, month, values),
    onSuccess: () => {
      toast.success("Budget updated successfully");
      queryClient.invalidateQueries({
        queryKey: [...budgetQueryKey, year, month],
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update budget");
    },
  });
};

export const useDeleteBudget = (year: number, month: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteBudget(year, month),
    onSuccess: () => {
      toast.success("Budget deleted successfully");
      queryClient.invalidateQueries({
        queryKey: [...budgetQueryKey, year, month],
      });
    },
    onError: (error) => {
      toast.error(error.message || "dsafas");
    },
  });
};
