export interface Expense {
  id: number;
  amount: number;
  description: string;
  date: string;
  categoryId: number;
  userId: number;
}

export interface FixedExpense {
  id: number;
  amount: number;
  description: string;
  date: string;
  userId: number;
}

export interface Income {
  id: number;
  amount: number;
  description: string;
  date: string;
  userId: number;
  type: string;
}

export interface Category {
  id: number;
  name: string;
  userId: number;
}

export interface User {
  id: number;
  username: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

