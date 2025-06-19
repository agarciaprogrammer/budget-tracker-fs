import api from './api';
import type { User, LoginResponse } from '../types';

export async function login(username: string, password: string): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>('/auth/login', {
    username,
    password
  });
  return response.data;
}

export async function register(username: string, password: string): Promise<User> {
  const response = await api.post<User>('/auth/register', {
    username,
    password
  });
  return response.data;
}

export function logout(): void {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export function getCurrentUser(): User | null {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

export function getToken(): string | null {
  return localStorage.getItem('token');
}   