export interface Transactions {
  id: string;
  title: string;
  amount: number;
  category: string;
  type: "expense" | "income";
  createdAt: string;
  updatedAt: string;
}
export type CreateTransaction = Omit<Transactions, "id" | "createdAt" | "updatedAt">;

export type TransactionsFilterState = "all" | "income" | "expense";
