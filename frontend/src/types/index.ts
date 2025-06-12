export interface Expense {
  id: number;
  amount: number;
  description: string;
  date: string;
  categoryId: number;
}

export interface Category {
  id: number;
  name: string;
}

export interface User {
  id: number;
  username: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}