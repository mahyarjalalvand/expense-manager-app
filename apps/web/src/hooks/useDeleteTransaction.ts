import { deleteTransaction } from "@/api/transactions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionsQueryKey } from "./useTransactions";

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: transactionsQueryKey,
      });
    },
  });
};
