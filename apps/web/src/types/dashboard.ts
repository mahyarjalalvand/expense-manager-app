import type { Transaction } from "./transactions";

export interface DashboardData {
  summary: {
    income: number;
    expenses: number;
    balance: number;
  };
  dailyData: {
    date: string;
    income: number;
    expenses: number;
  }[];
  recentTransactions: {
    amount: number;
    title: string;
    id: string;
    type: Transaction["type"];
    categoryName: string;
  }[];
}
