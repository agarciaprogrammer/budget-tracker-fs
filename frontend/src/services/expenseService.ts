import axios from 'axios';
import type { Expense } from '../types';

const API_URL = 'http://localhost:3001/api/expenses';

export async function getExpenses(): Promise<Expense[]> {
  const token = localStorage.getItem('token');
  const response = await axios.get<Expense[]>(API_URL, {
    headers: {Authorization: `Bearer ${token}`},
  });
  return response.data;
}

export async function createExpense(expense: Omit<Expense, 'id'>): Promise<Expense> {
  const token = localStorage.getItem('token');
  const response = await axios.post<Expense>(API_URL, expense, {
    headers: {Authorization: `Bearer ${token}`},
  });
  return response.data;
}

export async function updateExpense(id: number, expense: Omit<Expense, 'id'>): Promise<Expense> {
  const token = localStorage.getItem('token');
  const response = await axios.put<Expense>(`${API_URL}/${id}`, expense, {
    headers: {Authorization: `Bearer ${token}`},
  });
  return response.data;
}

export async function deleteExpense(id: number): Promise<void> {
  const token = localStorage.getItem('token');
  await axios.delete(`${API_URL}/${id}`, {
    headers: {Authorization: `Bearer ${token}`},
  });
}
