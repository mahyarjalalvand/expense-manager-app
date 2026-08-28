import type { Transactions } from "./transactions";

export interface DashboardData {
  summary: {
    income: number;
    expense: number;
    balance: number;
  };
  dailyData: {
    date: string;
    income: number;
    expense: string;
  }[];
  recentTransactions: Transactions[];
}
