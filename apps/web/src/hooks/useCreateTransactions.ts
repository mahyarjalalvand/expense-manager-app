import { useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionsQueryKey } from "./useTransactions";
import { createTransaction } from "@/api/transactions";

export const useCreateTransactions = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: transactionsQueryKey,
      });
    },
  });
};
