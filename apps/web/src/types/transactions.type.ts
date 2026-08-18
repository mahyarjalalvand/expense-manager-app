export interface Transactions {
  id: string;
  title: string;
  amount: number;
  category: string;
  type: "expense" | "income";
  createdAt: string;
  updatedAt: string;
}
