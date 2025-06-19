import api from './api';
import type { Expense } from '../types';

export async function getExpenses(): Promise<Expense[]> {
  const response = await api.get<Expense[]>('/expenses');
  return response.data;
}

export async function createExpense(expense: Omit<Expense, 'id'>): Promise<Expense> {
  const response = await api.post<Expense>('/expenses', expense);
  return response.data;
}

export async function updateExpense(id: number, expense: Omit<Expense, 'id'>): Promise<Expense> {
  const response = await api.put<Expense>(`/expenses/${id}`, expense);
  return response.data;
}

export async function deleteExpense(id: number): Promise<void> {
  await api.delete(`/expenses/${id}`);
}
