import api from './api';
import type { Income } from '../types';

export async function getIncomes(): Promise<Income[]> {
  const response = await api.get<Income[]>('/incomes');
  return response.data;
}

export async function createIncome(income: Omit<Income, 'id'>): Promise<Income> {
  const response = await api.post<Income>('/incomes', income);
  return response.data;
}

export async function updateIncome(id: number, income: Omit<Income, 'id'>): Promise<Income> {
  const response = await api.put<Income>(`/incomes/${id}`, income);
  return response.data;
}

export async function deleteIncome(id: number): Promise<void> {
  await api.delete(`/incomes/${id}`);
}  
