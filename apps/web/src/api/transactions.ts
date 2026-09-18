import type { CreateTransaction, Transaction, Transactions, TransactionsFilterState } from "@/types/transactions";
import { api } from "@/utils/api";

export const getAllTransactions = async (page: number, limit: number, type: TransactionsFilterState): Promise<Transactions> => {
  try {
    const res = await api(`transactions?page=${page}&limit=${limit}&type=${type}`);

    if (!res.ok) {
      throw new Error(`failed to fetch transactions ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error("getAllTransactions failed:", error);
    throw error;
  }
};

export const createTransaction = async (data: CreateTransaction): Promise<Transaction> => {
  const res = await api("transactions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(`failed to create transaction: ${res.status}`);
  }
  return await res.json();
};

export const deleteTransaction = async (id: string) => {
  const res = await api("transactions", {
    method: "DELETE",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(id),
  });
  if (!res.ok) {
    throw new Error(`failed to delete transaction: ${res.status}`);
  }
  return res.json();
};
