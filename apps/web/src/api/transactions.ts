import type { CreateTransaction, Transactions } from "@/types/transactions";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const getAllTransactions = async (page: number, limit: number): Promise<Transactions> => {
  try {
    const res = await fetch(`${baseUrl}transactions?page=${page}&limit=${limit}`);
    if (!res.ok) {
      throw new Error(`failed to fetch transactions ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error("getAllTransactions failed:", error);
    throw error;
  }
};

export const createTransaction = async (data: CreateTransaction): Promise<Transactions> => {
  const res = await fetch(`${baseUrl}transactions`, {
    method: "POST",
    headers: {
      "content-type": "aplication/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(`failed to create transaction: ${res.status}`);
  }
  return await res.json();
};

export const deleteTransaction = async (id: string) => {
  const res = await fetch(`${baseUrl}transactions`, {
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
