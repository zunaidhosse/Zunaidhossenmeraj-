export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: Category;
  date: string; // ISO 8601 format
  notes?: string;
}

export interface Settings {
  currency: string;
  darkMode: boolean;
  spendingLimit: number | null;
}

export interface Payment {
  id: string;
  amount: number;
  date: string; // ISO 8601 format
  notes?: string;
}

export enum ReceivableStatus {
  PENDING = 'pending',
  RECEIVED = 'received',
}

export interface Receivable {
  id: string;
  personName: string;
  amount: number;
  date: string; // ISO 8601 format
  notes?: string;
  status: ReceivableStatus;
  payments: Payment[];
}

export interface PaymentMade {
  id: string;
  amount: number;
  date: string; // ISO 8601 format
  notes?: string;
}

export enum PayableStatus {
  DUE = 'due',
  PAID = 'paid',
}

export interface Payable {
  id: string;
  personName: string;
  amount: number;
  date: string; // ISO 8601 format
  notes?: string;
  status: PayableStatus;
  paymentsMade: PaymentMade[];
}
