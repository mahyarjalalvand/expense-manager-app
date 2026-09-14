export interface Transaction {
  title: string;
  amount: number;
  categoryId: string;
  type: "income" | "expense";
}
