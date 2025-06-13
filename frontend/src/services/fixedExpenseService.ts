import axios from 'axios';
import type { FixedExpense } from '../types';

const API_URL = 'http://localhost:3001/api/fixed-expenses';

export async function getFixedExpenses(): Promise<FixedExpense[]> {
  const token = localStorage.getItem('token');
  const response = await axios.get<FixedExpense[]>(API_URL, {
    headers: {Authorization: `Bearer ${token}`},
  });
  return response.data;
}

export async function createFixedExpense(fixedExpense: Omit<FixedExpense, 'id'>): Promise<FixedExpense> {
  const token = localStorage.getItem('token');
  const response = await axios.post<FixedExpense>(API_URL, fixedExpense, {
    headers: {Authorization: `Bearer ${token}`},
  });
  return response.data;
}

export async function deleteFixedExpense(id: number): Promise<void> {
  const token = localStorage.getItem('token');
  await axios.delete(`${API_URL}/${id}`, {
    headers: {Authorization: `Bearer ${token}`},
  });
}

export async function updateFixedExpense(id: number, fixedExpense: Omit<FixedExpense, 'id'>): Promise<FixedExpense> {
  const token = localStorage.getItem('token');
  const response = await axios.put<FixedExpense>(`${API_URL}/${id}`, fixedExpense, {
    headers: {Authorization: `Bearer ${token}`},
  });
  return response.data;
}

export async function getFixedExpensesByUserId(userId: number): Promise<FixedExpense[]> {
  const token = localStorage.getItem('token');
  const response = await axios.get<FixedExpense[]>(`${API_URL}/user/${userId}`, {
    headers: {Authorization: `Bearer ${token}`},
  });
  return response.data;
}

