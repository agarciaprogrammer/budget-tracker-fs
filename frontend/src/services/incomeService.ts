import axios from 'axios';
import type { Income } from '../types';

const API_URL = 'http://localhost:3001/api/incomes';

export async function getIncomes(): Promise<Income[]> {
  const token = localStorage.getItem('token');
  const response = await axios.get<Income[]>(API_URL, {
    headers: {Authorization: `Bearer ${token}`},
  });
  return response.data;
}

export async function createIncome(income: Omit<Income, 'id'>): Promise<Income> {
  const token = localStorage.getItem('token');
  const response = await axios.post<Income>(API_URL, income, {
    headers: {Authorization: `Bearer ${token}`},
  });
  return response.data;
}

export async function updateIncome(id: number, income: Omit<Income, 'id'>): Promise<Income> {
    const token = localStorage.getItem('token');
    const response = await axios.put<Income>(`${API_URL}/${id}`, income, {
        headers: {Authorization: `Bearer ${token}`},
    });
    return response.data;
}

export async function deleteIncome(id: number): Promise<void> {
    const token = localStorage.getItem('token');
    await axios.delete(`${API_URL}/${id}`, {
        headers: {Authorization: `Bearer ${token}`},
    });
}  
