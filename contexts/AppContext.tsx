import React, { createContext, ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { Transaction, Category, Settings, Receivable, Payment, Payable, PaymentMade } from '../types';
import { TransactionType, ReceivableStatus, PayableStatus } from '../types';
import { DEFAULT_CATEGORIES } from '../constants';

interface AppContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  categories: Category[];
  addCategory: (category: Omit<Category, 'id'>) => void;
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  resetData: () => void;
  totalIncome: number;
  totalExpense: number;
  balance: number;
  receivables: Receivable[];
  addReceivable: (receivable: Omit<Receivable, 'id' | 'status' | 'payments'>) => void;
  updateReceivable: (receivable: Receivable) => void;
  deleteReceivable: (id: string) => void;
  addPayment: (receivableId: string, payment: Omit<Payment, 'id'>) => void;
  totalPendingReceivables: number;
  payables: Payable[];
  addPayable: (payable: Omit<Payable, 'id' | 'status' | 'paymentsMade'>) => void;
  updatePayable: (payable: Payable) => void;
  deletePayable: (id: string) => void;
  addPaymentMade: (payableId: string, payment: Omit<PaymentMade, 'id'>) => void;
  totalDuePayables: number;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('transactions', []);
  const [categories, setCategories] = useLocalStorage<Category[]>('categories', DEFAULT_CATEGORIES);
  const [settings, setSettings] = useLocalStorage<Settings>('settings', {
    currency: 'SAR',
    darkMode: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches,
    spendingLimit: null,
  });
  const [receivables, setReceivables] = useLocalStorage<Receivable[]>('receivables', []);
  const [payables, setPayables] = useLocalStorage<Payable[]>('payables', []);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = { ...transaction, id: new Date().toISOString() + Math.random() };
    setTransactions(prev => [newTransaction, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  const updateTransaction = (updatedTransaction: Transaction) => {
    setTransactions(prev => prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };
  
  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory = { ...category, id: category.name.toLowerCase().replace(' ', '-') };
    if(!categories.find(c => c.id === newCategory.id)){
      setCategories(prev => [...prev, newCategory]);
    }
  };

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };
  
  const resetData = () => {
      setTransactions([]);
      setCategories(DEFAULT_CATEGORIES);
      setSettings({
        currency: 'SAR',
        darkMode: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches,
        spendingLimit: null,
      });
      setReceivables([]);
      setPayables([]);
  }

  const addReceivable = (receivable: Omit<Receivable, 'id' | 'status' | 'payments'>) => {
    const newReceivable: Receivable = { 
      ...receivable, 
      id: new Date().toISOString() + Math.random(),
      status: ReceivableStatus.PENDING,
      payments: []
    };
    setReceivables(prev => [newReceivable, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  const updateReceivable = (updatedReceivable: Receivable) => {
    setReceivables(prev => prev.map(r => r.id === updatedReceivable.id ? updatedReceivable : r).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  const deleteReceivable = (id: string) => {
    setReceivables(prev => prev.filter(r => r.id !== id));
  };

  const addPayment = (receivableId: string, paymentData: Omit<Payment, 'id'>) => {
    let targetReceivable: Receivable | undefined;
    
    setReceivables(prev => {
        const newReceivables = prev.map(r => {
            if (r.id === receivableId) {
                const newPayment: Payment = {
                    ...paymentData,
                    id: new Date().toISOString() + Math.random(),
                };
                const updatedPayments = [...(r.payments || []), newPayment];
                const totalPaid = updatedPayments.reduce((sum, p) => sum + p.amount, 0);
                const newStatus = totalPaid >= r.amount ? ReceivableStatus.RECEIVED : ReceivableStatus.PENDING;

                targetReceivable = {
                    ...r,
                    payments: updatedPayments,
                    status: newStatus,
                };
                return targetReceivable;
            }
            return r;
        });
        return newReceivables;
    });

    if(targetReceivable) {
        addTransaction({
            type: TransactionType.INCOME,
            amount: paymentData.amount,
            category: { id: 'income', name: 'Income', icon: '💰' },
            date: paymentData.date,
            notes: `Payment from ${targetReceivable.personName}${paymentData.notes ? ` - ${paymentData.notes}` : ''}`
        });
    }
  };

  const addPayable = (payable: Omit<Payable, 'id' | 'status' | 'paymentsMade'>) => {
    const newPayable: Payable = { 
      ...payable, 
      id: new Date().toISOString() + Math.random(),
      status: PayableStatus.DUE,
      paymentsMade: []
    };
    setPayables(prev => [newPayable, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  const updatePayable = (updatedPayable: Payable) => {
    setPayables(prev => prev.map(p => p.id === updatedPayable.id ? updatedPayable : p).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  const deletePayable = (id: string) => {
    setPayables(prev => prev.filter(p => p.id !== id));
  };

  const addPaymentMade = (payableId: string, paymentData: Omit<PaymentMade, 'id'>) => {
    let targetPayable: Payable | undefined;
    
    setPayables(prev => {
        const newPayables = prev.map(p => {
            if (p.id === payableId) {
                const newPayment: PaymentMade = {
                    ...paymentData,
                    id: new Date().toISOString() + Math.random(),
                };
                const updatedPayments = [...(p.paymentsMade || []), newPayment];
                const totalPaid = updatedPayments.reduce((sum, payment) => sum + payment.amount, 0);
                const newStatus = totalPaid >= p.amount ? PayableStatus.PAID : PayableStatus.DUE;

                targetPayable = {
                    ...p,
                    paymentsMade: updatedPayments,
                    status: newStatus,
                };
                return targetPayable;
            }
            return p;
        });
        return newPayables.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    });

    if(targetPayable) {
        addTransaction({
            type: TransactionType.EXPENSE,
            amount: paymentData.amount,
            category: categories.find(c => c.id === 'other') || { id: 'other', name: 'Others', icon: '...' },
            date: paymentData.date,
            notes: `Payment to ${targetPayable.personName}${paymentData.notes ? ` - ${paymentData.notes}` : ''}`
        });
    }
  };

  const { totalIncome, totalExpense } = transactions.reduce(
    (acc, t) => {
      if (t.type === TransactionType.INCOME) {
        acc.totalIncome += t.amount;
      } else {
        acc.totalExpense += t.amount;
      }
      return acc;
    },
    { totalIncome: 0, totalExpense: 0 }
  );

  const totalPendingReceivables = receivables
    .reduce((total, receivable) => {
        const paidAmount = (receivable.payments || []).reduce((sum, p) => sum + p.amount, 0);
        const remaining = receivable.amount - paidAmount;
        return receivable.status === ReceivableStatus.PENDING ? total + remaining : total;
    }, 0);

  const totalDuePayables = payables
    .reduce((total, payable) => {
        const paidAmount = (payable.paymentsMade || []).reduce((sum, p) => sum + p.amount, 0);
        const remaining = payable.amount - paidAmount;
        return payable.status === PayableStatus.DUE ? total + remaining : total;
    }, 0);

  const balance = totalIncome - totalExpense;

  const value = {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    categories,
    addCategory,
    settings,
    updateSettings,
    resetData,
    totalIncome,
    totalExpense,
    balance,
    receivables,
    addReceivable,
    updateReceivable,
    deleteReceivable,
    addPayment,
    totalPendingReceivables,
    payables,
    addPayable,
    updatePayable,
    deletePayable,
    addPaymentMade,
    totalDuePayables,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
