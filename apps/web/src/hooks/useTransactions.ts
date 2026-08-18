import { getAllTransactions } from "@/api/transactions";
import { useQuery } from "@tanstack/react-query";

export const transactionsQueryKey = ["transactions"];

export const useTransactions = () => {
  return useQuery({
    queryKey: transactionsQueryKey,
    queryFn: getAllTransactions,
  });
};
