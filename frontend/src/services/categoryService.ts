import api from "./api";
import type { Category } from "../types";

export async function getCategories(): Promise<Category[]> {
  const response = await api.get<Category[]>('/categories');
  return response.data;
}

export async function createCategory(category: Omit<Category, 'id'>): Promise<Category> {
  const response = await api.post<Category>('/categories', category);
  return response.data;
}

export async function updateCategory(id: number, category: Omit<Category, 'id'>): Promise<Category> {
  const response = await api.put<Category>(`/categories/${id}`, category);
  return response.data;
}

export async function deleteCategory(id: number): Promise<void> {
  await api.delete(`/categories/${id}`);
}