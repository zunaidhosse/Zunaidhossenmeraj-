import React, { useContext, useState, useMemo } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, ArrowLeft, AlertTriangle, Trash2 } from 'lucide-react';

const PayablesList: React.FC = () => {
  const context = useContext(AppContext);
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'due' | 'paid' | 'all'>('due');

  const filteredPayables = useMemo(() => {
    if (!context) return [];
    if (filter === 'all') return context.payables;
    return context.payables.filter(p => p.status === filter);
  }, [context, filter]);

  if (!context) return null;
  const { deletePayable, settings } = context;

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this payable record? This cannot be undone.')) {
        deletePayable(id);
    }
  };

  return (
    <div className="p-4 space-y-4 pb-20">
      <header className="flex items-center gap-4">
          <button onClick={() => navigate('/')} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
              <ArrowLeft />
          </button>
          <h1 className="text-2xl font-bold">দেনা (Payables)</h1>
      </header>

      <div className="flex gap-2">
        <button onClick={() => setFilter('due')} className={`px-4 py-1 rounded-full text-sm ${filter === 'due' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>Due</button>
        <button onClick={() => setFilter('paid')} className={`px-4 py-1 rounded-full text-sm ${filter === 'paid' ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>Paid</button>
        <button onClick={() => setFilter('all')} className={`px-4 py-1 rounded-full text-sm ${filter === 'all' ? 'bg-gray-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>All</button>
      </div>

      {filteredPayables.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2">No payables found for this filter.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPayables.map(p => {
            const paidAmount = (p.paymentsMade || []).reduce((sum, payment) => sum + payment.amount, 0);
            const remainingAmount = p.amount - paidAmount;
            const progress = p.amount > 0 ? (paidAmount / p.amount) * 100 : 0;

            return (
              <Link to={`/payables/${p.id}`} key={p.id} className="block">
                <div className={`bg-light-card/80 dark:bg-dark-card/80 backdrop-blur-xl rounded-lg p-3 shadow-sm transition-opacity ${p.status === 'paid' ? 'opacity-60' : ''}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-bold text-lg truncate">{p.personName}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Remaining: <span className="font-semibold text-orange-500">{remainingAmount.toLocaleString()} {settings.currency}</span>
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Total: {p.amount.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 ml-2">
                      <div className="w-20 text-right">
                         <div className="text-xs font-semibold">{paidAmount.toLocaleString()} Paid</div>
                         <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-1">
                            <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
                         </div>
                      </div>
                      <button onClick={(e) => { e.preventDefault(); handleDelete(p.id); }} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full">
                        <Trash2 size={16}/>
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}

      <button
        onClick={() => navigate('/payables/add')}
        className="fixed bottom-24 right-4 z-20 flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full shadow-lg shadow-primary/50 text-white"
        aria-label="Add Payable"
      >
        <Plus size={32} />
      </button>
    </div>
  );
};

export default PayablesList;
