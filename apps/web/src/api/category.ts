import type { CreateCategory, UpdateCategory } from "@/schemas/categories.schema";
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

export const createCategory = async (data: CreateCategory) => {
  const res = await api("categories", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(`failed to create category ${res.status}`);
  }
  return res.json();
};

export const updateCategory = async (categoryId: string, data: UpdateCategory) => {
  const res = await api(`categories/${categoryId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(`failed to update category ${res.status}`);
  }
  return res.json();
};
