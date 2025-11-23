
import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../../contexts/AppContext';
import { TransactionType } from '../../types';
import type { Category } from '../../types';

const AddTransaction: React.FC = () => {
  const context = useContext(AppContext);
  const navigate = useNavigate();
  const { type, id } = useParams();
  
  const isEditing = !!id;
  const transactionToEdit = isEditing ? context?.transactions.find(t => t.id === id) : null;
  const transactionType = isEditing ? transactionToEdit?.type : (type as TransactionType);

  const [amount, setAmount] = useState<number | ''>(isEditing ? transactionToEdit?.amount || '' : '');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(isEditing ? transactionToEdit?.category || null : null);
  const [date, setDate] = useState(isEditing ? transactionToEdit?.date.split('T')[0] || '' : new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState(isEditing ? transactionToEdit?.notes || '' : '');
  
  useEffect(() => {
    if (isEditing && transactionToEdit) {
      setAmount(transactionToEdit.amount);
      setSelectedCategory(transactionToEdit.category);
      setDate(transactionToEdit.date.split('T')[0]);
      setNotes(transactionToEdit.notes || '');
    }
  }, [isEditing, transactionToEdit]);

  if (!context) return null;
  
  const { addTransaction, updateTransaction, categories } = context;

  const availableCategories = transactionType === TransactionType.INCOME
    ? categories.filter(c => c.id === 'income')
    : categories.filter(c => c.id !== 'income');

  useEffect(() => {
    if (transactionType === TransactionType.INCOME) {
      const incomeCategory = categories.find(c => c.id === 'income');
      if(incomeCategory) setSelectedCategory(incomeCategory);
    }
  }, [transactionType, categories]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount && selectedCategory && date) {
      const transactionData = {
        type: transactionType!,
        amount: +amount,
        category: selectedCategory,
        date: new Date(date).toISOString(),
        notes,
      };
      if (isEditing && transactionToEdit) {
        updateTransaction({ ...transactionData, id: transactionToEdit.id });
      } else {
        addTransaction(transactionData);
      }
      navigate('/history');
    } else {
      alert("Please fill all required fields.");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6 text-center capitalize">{isEditing ? 'Edit' : 'Add'} {transactionType}</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-500 dark:text-gray-400">Amount</label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value ? parseFloat(e.target.value) : '')}
            placeholder="0.00"
            className="mt-1 w-full text-3xl font-bold bg-transparent border-b-2 border-gray-300 dark:border-gray-600 focus:ring-0 focus:border-primary py-2"
            required
          />
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Category</label>
            <div className="grid grid-cols-4 gap-3 mt-2">
                {availableCategories.map(cat => (
                    <button type="button" key={cat.id} onClick={() => setSelectedCategory(cat)} className={`flex flex-col items-center p-2 rounded-lg border-2 transition-all ${selectedCategory?.id === cat.id ? 'border-primary bg-primary/10' : 'border-transparent bg-gray-100 dark:bg-gray-800'}`}>
                        <span className="text-2xl">{cat.icon}</span>
                        <span className="text-xs mt-1 text-center">{cat.name}</span>
                    </button>
                ))}
            </div>
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-500 dark:text-gray-400">Date</label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 w-full bg-gray-100 dark:bg-gray-800 border-transparent focus:ring-primary focus:border-primary rounded-lg py-2"
            required
          />
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-500 dark:text-gray-400">Notes (Optional)</label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="mt-1 w-full bg-gray-100 dark:bg-gray-800 border-transparent focus:ring-primary focus:border-primary rounded-lg py-2"
            placeholder="e.g., Lunch with client"
          />
        </div>
        
        <div className="pt-4">
            <button type="submit" className="w-full text-white bg-gradient-to-br from-primary to-accent font-semibold py-3 px-4 rounded-lg shadow-lg hover:opacity-90 transition-opacity">
                {isEditing ? 'Update Transaction' : 'Save Transaction'}
            </button>
        </div>
      </form>
    </div>
  );
};

export default AddTransaction;
