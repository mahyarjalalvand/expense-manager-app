export interface Transaction {
  title: string;
  amount: number;
  category: string;
  type: "income" | "expense";
}
