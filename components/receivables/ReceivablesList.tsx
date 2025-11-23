import React, { useContext, useState, useMemo } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, ArrowLeft, AlertTriangle, Trash2 } from 'lucide-react';

const ReceivablesList: React.FC = () => {
  const context = useContext(AppContext);
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'pending' | 'received' | 'all'>('pending');

  const filteredReceivables = useMemo(() => {
    if (!context) return [];
    if (filter === 'all') return context.receivables;
    return context.receivables.filter(r => r.status === filter);
  }, [context, filter]);

  if (!context) return null;
  const { deleteReceivable, settings } = context;

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this receivable record? This cannot be undone.')) {
        deleteReceivable(id);
    }
  };

  return (
    <div className="p-4 space-y-4 pb-20">
      <header className="flex items-center gap-4">
          <button onClick={() => navigate('/')} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
              <ArrowLeft />
          </button>
          <h1 className="text-2xl font-bold">টাকা পাই (Receivables)</h1>
      </header>

      <div className="flex gap-2">
        <button onClick={() => setFilter('pending')} className={`px-4 py-1 rounded-full text-sm ${filter === 'pending' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>Pending</button>
        <button onClick={() => setFilter('received')} className={`px-4 py-1 rounded-full text-sm ${filter === 'received' ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>Received</button>
        <button onClick={() => setFilter('all')} className={`px-4 py-1 rounded-full text-sm ${filter === 'all' ? 'bg-gray-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>All</button>
      </div>

      {filteredReceivables.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2">No receivables found for this filter.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredReceivables.map(r => {
            const paidAmount = (r.payments || []).reduce((sum, p) => sum + p.amount, 0);
            const remainingAmount = r.amount - paidAmount;
            const progress = r.amount > 0 ? (paidAmount / r.amount) * 100 : 0;

            return (
              <Link to={`/receivables/${r.id}`} key={r.id} className="block">
                <div className={`bg-light-card/80 dark:bg-dark-card/80 backdrop-blur-xl rounded-lg p-3 shadow-sm transition-opacity ${r.status === 'received' ? 'opacity-60' : ''}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-bold text-lg truncate">{r.personName}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Remaining: <span className="font-semibold text-blue-500">{remainingAmount.toLocaleString()} {settings.currency}</span>
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Total: {r.amount.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 ml-2">
                      <div className="w-20 text-right">
                         <div className="text-xs font-semibold">{paidAmount.toLocaleString()} Paid</div>
                         <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-1">
                            <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
                         </div>
                      </div>
                      <button onClick={(e) => { e.preventDefault(); handleDelete(r.id); }} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full">
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
        onClick={() => navigate('/receivables/add')}
        className="fixed bottom-24 right-4 z-20 flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full shadow-lg shadow-primary/50 text-white"
        aria-label="Add Receivable"
      >
        <Plus size={32} />
      </button>
    </div>
  );
};

export default ReceivablesList;