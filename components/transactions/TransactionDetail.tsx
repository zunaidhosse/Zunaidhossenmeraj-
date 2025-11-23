
import React, { useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../../contexts/AppContext';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';

const TransactionDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const context = useContext(AppContext);
    
    const transaction = context?.transactions.find(t => t.id === id);

    if (!context || !transaction) {
        return (
            <div className="p-4 text-center">
                <p>Transaction not found.</p>
                <button onClick={() => navigate('/history')} className="mt-4 text-primary">Go Back</button>
            </div>
        );
    }

    const { deleteTransaction, settings } = context;

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            deleteTransaction(transaction.id);
            navigate('/history');
        }
    };
    
    return (
        <div className="p-4 space-y-6">
            <header className="flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                    <ArrowLeft />
                </button>
                <h1 className="text-2xl font-bold">Transaction Details</h1>
            </header>
            
            <div className="bg-light-card/80 dark:bg-dark-card/80 backdrop-blur-xl rounded-2xl p-6 space-y-4 text-center">
                <div className="text-6xl mx-auto">{transaction.category.icon}</div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{transaction.category.name}</p>
                <p className={`text-4xl font-bold ${transaction.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                    {transaction.type === 'income' ? '+' : '-'} {transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} {settings.currency}
                </p>
                <p className="text-gray-500 dark:text-gray-400">{new Date(transaction.date).toLocaleString(undefined, { dateStyle: 'full', timeStyle: 'short' })}</p>
            </div>
            
            {transaction.notes && (
                <div className="bg-light-card/80 dark:bg-dark-card/80 backdrop-blur-xl rounded-2xl p-4">
                    <h3 className="font-semibold mb-2">Notes</h3>
                    <p className="text-gray-600 dark:text-gray-300">{transaction.notes}</p>
                </div>
            )}
            
            <div className="flex gap-4 pt-4">
                <button onClick={handleDelete} className="w-full flex items-center justify-center gap-2 text-red-500 bg-red-100 dark:bg-red-900/50 font-semibold py-3 px-4 rounded-lg transition-colors hover:bg-red-200 dark:hover:bg-red-900">
                    <Trash2 size={20} /> Delete
                </button>
                <button onClick={() => navigate(`/edit/${transaction.id}`)} className="w-full flex items-center justify-center gap-2 text-white bg-primary font-semibold py-3 px-4 rounded-lg transition-colors hover:opacity-90">
                    <Edit size={20} /> Edit
                </button>
            </div>
        </div>
    );
};

export default TransactionDetail;
