
import React, { useContext } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppContext } from './contexts/AppContext';

import Dashboard from './components/dashboard/Dashboard';
import TransactionHistory from './components/transactions/TransactionHistory';
import AddTransaction from './components/transactions/AddTransaction';
import AddTransactionChoice from './components/transactions/AddTransactionChoice';
import MonthlyReport from './components/reports/MonthlyReport';
import Settings from './components/settings/Settings';
import BottomNav from './components/layout/BottomNav';
import TransactionDetail from './components/transactions/TransactionDetail';
import ReceivablesList from './components/receivables/ReceivablesList';
import AddReceivable from './components/receivables/AddReceivable';
import ReceivableDetail from './components/receivables/ReceivableDetail';
import PayablesList from './components/payables/PayablesList';
import AddPayable from './components/payables/AddPayable';
import PayableDetail from './components/payables/PayableDetail';
import InstallPWAButton from './components/pwa/InstallPWAButton';

const App: React.FC = () => {
  const context = useContext(AppContext);

  if (!context) {
    return <div>Loading...</div>;
  }
  const { settings } = context;

  return (
    <div className={`${settings.darkMode ? 'dark' : ''} font-sans`}>
      <div className="min-h-screen bg-light-bg dark:bg-dark-bg text-gray-800 dark:text-gray-200">
        <HashRouter>
          <main className="pb-20 max-w-lg mx-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/history" element={<TransactionHistory />} />
              <Route path="/history/:id" element={<TransactionDetail />} />
              <Route path="/add" element={<AddTransactionChoice />} />
              <Route path="/add/:type" element={<AddTransaction />} />
              <Route path="/edit/:id" element={<AddTransaction />} />
              <Route path="/reports" element={<MonthlyReport />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/receivables" element={<ReceivablesList />} />
              <Route path="/receivables/:id" element={<ReceivableDetail />} />
              <Route path="/receivables/add" element={<AddReceivable />} />
              <Route path="/receivables/edit/:id" element={<AddReceivable />} />
              <Route path="/payables" element={<PayablesList />} />
              <Route path="/payables/:id" element={<PayableDetail />} />
              <Route path="/payables/add" element={<AddPayable />} />
              <Route path="/payables/edit/:id" element={<AddPayable />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          <BottomNav />
        </HashRouter>
        <InstallPWAButton />
      </div>
    </div>
  );
};

export default App;