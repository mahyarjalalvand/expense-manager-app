import { getAllTransactions } from "@/api/transactions";
import type { TransactionsFilterState } from "@/types/transactions";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const transactionsQueryKey = ["transactions"];

export const useTransactions = (page: number, limit: number, type: TransactionsFilterState) => {
  return useQuery({
    queryKey: [...transactionsQueryKey, page, limit, type],
    queryFn: () => getAllTransactions(page, limit, type),
    placeholderData: keepPreviousData,
  });
};
