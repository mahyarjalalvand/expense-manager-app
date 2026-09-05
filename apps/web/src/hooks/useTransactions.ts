import { getAllTransactions } from "@/api/transactions";
import { useQuery } from "@tanstack/react-query";

export const transactionsQueryKey = ["transactions"];

export const useTransactions = (page: number, limit: number) => {
  return useQuery({
    queryKey: [transactionsQueryKey, page, limit],
    queryFn: () => getAllTransactions(page, limit),
  });
};
