
import React, { useContext, useState, useMemo } from 'react';
import { AppContext } from '../../contexts/AppContext';
import type { Transaction } from '../../types';
import { Link } from 'react-router-dom';
import { Search, SlidersHorizontal, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

const TransactionHistory: React.FC = () => {
  const context = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredTransactions = useMemo(() => {
    if (!context) return [];
    return context.transactions
      .filter(t => {
        if (filterType === 'all') return true;
        return t.type === filterType;
      })
      .filter(t => {
        const searchLower = searchTerm.toLowerCase();
        return (
          t.category.name.toLowerCase().includes(searchLower) ||
          t.amount.toString().includes(searchLower) ||
          (t.notes && t.notes.toLowerCase().includes(searchLower))
        );
      });
  }, [context, searchTerm, filterType]);

  if (!context) return null;

  const groupTransactionsByDate = (transactions: Transaction[]) => {
    return transactions.reduce((acc, t) => {
      const date = new Date(t.date).toLocaleDateString('en-CA'); // YYYY-MM-DD
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(t);
      return acc;
    }, {} as Record<string, Transaction[]>);
  };
  
  const groupedTransactions = groupTransactionsByDate(filteredTransactions);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Transaction History</h1>
      <div className="sticky top-0 bg-light-bg dark:bg-dark-bg py-2 z-10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-100 dark:bg-gray-800 border-transparent focus:ring-primary focus:border-primary rounded-lg pl-10 pr-4 py-2"
          />
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={() => setFilterType('all')} className={`px-4 py-1 rounded-full text-sm ${filterType === 'all' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>All</button>
          <button onClick={() => setFilterType('income')} className={`px-4 py-1 rounded-full text-sm ${filterType === 'income' ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>Income</button>
          <button onClick={() => setFilterType('expense')} className={`px-4 py-1 rounded-full text-sm ${filterType === 'expense' ? 'bg-red-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>Expense</button>
        </div>
      </div>
      
      {Object.keys(groupedTransactions).length === 0 ? (
        <div className="text-center py-10 text-gray-500">
            <p>No transactions found.</p>
        </div>
      ) : (
        Object.entries(groupedTransactions).map(([date, transactions]) => (
          <div key={date}>
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">{new Date(date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h2>
            <div className="space-y-2">
              {transactions.map(t => (
                <Link to={`/history/${t.id}`} key={t.id} className="block">
                  <div className="bg-light-card/80 dark:bg-dark-card/80 backdrop-blur-xl rounded-lg p-3 flex items-center justify-between shadow-sm hover:scale-[1.02] transition-transform">
                      <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xl">{t.category.icon}</div>
                          <div>
                              <p className="font-semibold">{t.category.name}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{t.notes || 'No notes'}</p>
                          </div>
                      </div>
                      <p className={`font-semibold ${t.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                          {t.type === 'income' ? '+' : '-'} {t.amount.toLocaleString()} {context.settings.currency}
                      </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TransactionHistory;
