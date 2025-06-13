import axios from "axios";
import type { Category } from "../types";

const API_URL = 'http://localhost:3001/api/categories';

export async function getCategories(): Promise<Category[]> {
  const token = localStorage.getItem('token');
  const response = await axios.get<Category[]>(API_URL, {
    headers: {Authorization: `Bearer ${token}`},
  });
  return response.data;
}

export async function createCategory(category: Omit<Category, 'id'>): Promise<Category> {
  const token = localStorage.getItem('token');
  const response = await axios.post<Category>(API_URL, category, {
    headers: {Authorization: `Bearer ${token}`},
  });
  return response.data;
}

export async function updateCategory(id: number, category: Omit<Category, 'id'>): Promise<Category> {
  const token = localStorage.getItem('token');
  const response = await axios.put<Category>(`${API_URL}/${id}`, category, {
    headers: {Authorization: `Bearer ${token}`},
  });
  return response.data;
}

export async function deleteCategory(id: number): Promise<void> {
  const token = localStorage.getItem('token');
  await axios.delete(`${API_URL}/${id}`, {
    headers: {Authorization: `Bearer ${token}`},
  });
}