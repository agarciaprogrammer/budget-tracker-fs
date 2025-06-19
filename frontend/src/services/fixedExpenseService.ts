import api from './api';
import type { FixedExpense } from '../types';

export async function getFixedExpenses(): Promise<FixedExpense[]> {
  const response = await api.get<FixedExpense[]>('/fixed-expenses');
  return response.data;
}

export async function createFixedExpense(fixedExpense: Omit<FixedExpense, 'id'>): Promise<FixedExpense> {
  const response = await api.post<FixedExpense>('/fixed-expenses', fixedExpense);
  return response.data;
}

export async function deleteFixedExpense(id: number): Promise<void> {
  await api.delete(`/fixed-expenses/${id}`);
}

export async function updateFixedExpense(id: number, fixedExpense: Omit<FixedExpense, 'id'>): Promise<FixedExpense> {
  const response = await api.put<FixedExpense>(`/fixed-expenses/${id}`, fixedExpense);
  return response.data;
}

export async function getFixedExpensesByUserId(userId: number): Promise<FixedExpense[]> {
  const response = await api.get<FixedExpense[]>(`/fixed-expenses/user/${userId}`);
  return response.data;
}

