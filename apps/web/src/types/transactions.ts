export interface Transaction {
  id: string;
  title: string;
  amount: number;
  category: string;
  type: "expense" | "income";
  createdAt: string;
  updatedAt: string;
}

export interface Transactions {
  data: Transaction[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
export type CreateTransaction = Omit<Transactions, "id" | "createdAt" | "updatedAt">;

export type TransactionsFilterState = "all" | "income" | "expense";
