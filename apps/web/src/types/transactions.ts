export interface Transaction {
  id: string;
  title: string;
  amount: number;
  categoryId: string;
  type: "expense" | "income";
  createdAt: string;
  updatedAt: string;
  category: {
    color: string;
    icon: string;
    id: string;
    name: string;
  };
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
export type CreateTransaction = {
  title: string;
  amount: number;
  categoryId: string;
  type: "expense" | "income";
};

export type TransactionsFilterState = "all" | "income" | "expense";
