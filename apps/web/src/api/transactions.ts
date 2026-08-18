import type { Transactions } from "@/types/transactions.type";

export const getAllTransactions = async (): Promise<Transactions[]> => {
  try {
    const res = await fetch("http://localhost:3000/api/transactions");
    if (!res.ok) {
      throw new Error(`failed to fetch transactions ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error("getAllTransactions failed:", error);
    throw error;
  }
};
