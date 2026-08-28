import type { Transactions } from "./transactions";

export interface DashboardData {
  summary: {
    income: number;
    expenses: number;
    balance: number;
  };
  dailyData: {
    date: string;
    income: number;
    expenses: string;
  }[];
  recentTransactions: Transactions[];
}
