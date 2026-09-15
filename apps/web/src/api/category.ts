import type { Category } from "@/types/categories";
import { api } from "@/utils/api";

export const getCategories = async (): Promise<Category[]> => {
  const res = await api("categories");
  if (!res.ok) {
    throw new Error(`failed to fetch categories ${res.status}`);
  }
  const data = await res.json();
  return await data;
};
