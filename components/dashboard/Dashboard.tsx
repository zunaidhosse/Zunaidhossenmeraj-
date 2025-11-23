import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../contexts/AppContext';
import Card from '../ui/Card';
import { ArrowUpRight, ArrowDownLeft, MoreVertical, Sparkles, HandCoins, Handshake } from 'lucide-react';
import { getMotivationalQuote } from '../../services/geminiService';
import AdminPanel from './AdminPanel';

const Dashboard: React.FC = () => {
  const context = useContext(AppContext);
  const [quote, setQuote] = useState('');
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);

  useEffect(() => {
    fetchQuote();
  }, []);

  const fetchQuote = async () => {
    setLoadingQuote(true);
    const newQuote = await getMotivationalQuote();
    setQuote(newQuote);
    setLoadingQuote(false);
  };
  
  if (!context) return null;

  const { balance, settings, totalIncome, totalExpense, totalPendingReceivables, totalDuePayables } = context;
  
  const balanceColor = balance >= 0 ? 'text-green-400' : 'text-red-400';

  return (
    <div className="p-4 space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Hello, Driver!</h1>
          <p className="text-gray-500 dark:text-gray-400">Welcome back to your ledger.</p>
        </div>
        <button onClick={() => setIsAdminPanelOpen(true)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            <MoreVertical />
        </button>
      </header>
      
      <div className="relative overflow-hidden rounded-3xl shadow-2xl group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary transition-transform duration-500 group-hover:scale-105"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative p-6 text-white transform-style-3d group-hover:rotate-y-3">
          <p className="text-sm opacity-80">Total Balance</p>
          <h2 className={`text-4xl font-bold mt-2 ${balanceColor}`}>{balance.toLocaleString(undefined, { minimumFractionDigits: 2 })} <span className="text-2xl font-normal opacity-80">{settings.currency}</span></h2>
          {settings.spendingLimit && (
            <p className="text-xs mt-4 opacity-70">
              Today's spending limit: {settings.spendingLimit.toLocaleString()} {settings.currency}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Income</p>
            <p className="text-xl font-semibold text-green-500">{totalIncome.toLocaleString()}</p>
          </div>
          <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-full">
            <ArrowUpRight className="text-green-500" />
          </div>
        </Card>
        <Card className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Expense</p>
            <p className="text-xl font-semibold text-red-500">{totalExpense.toLocaleString()}</p>
          </div>
          <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-full">
            <ArrowDownLeft className="text-red-500" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Link to="/receivables" className="block">
          <Card className="flex items-start justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors h-full">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">টাকা পাই (Receivables)</p>
              <p className="text-xl font-semibold text-blue-500">{totalPendingReceivables.toLocaleString()}</p>
            </div>
            <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-full">
              <HandCoins className="text-blue-500" />
            </div>
          </Card>
        </Link>
        <Link to="/payables" className="block">
          <Card className="flex items-start justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors h-full">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">দেনা (Payables)</p>
              <p className="text-xl font-semibold text-orange-500">{totalDuePayables.toLocaleString()}</p>
            </div>
            <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-full">
              <Handshake className="text-orange-500" />
            </div>
          </Card>
        </Link>
      </div>
      
      <Card>
        <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">Motivational Quote</h3>
            <button onClick={fetchQuote} disabled={loadingQuote} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50">
                <Sparkles className={`w-5 h-5 ${loadingQuote ? 'animate-spin' : ''}`} />
            </button>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 italic">"{quote}"</p>
      </Card>
      
      {balance < 100 && balance > 0 && <div className="text-center text-red-500 p-2 bg-red-100 dark:bg-red-900/50 rounded-lg">Warning: Your balance is low!</div>}

      <AdminPanel isOpen={isAdminPanelOpen} onClose={() => setIsAdminPanelOpen(false)} />
    </div>
  );
};

export default Dashboard;
