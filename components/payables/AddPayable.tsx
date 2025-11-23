import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../../contexts/AppContext';
import { ArrowLeft } from 'lucide-react';

const AddPayable: React.FC = () => {
  const context = useContext(AppContext);
  const navigate = useNavigate();
  const { id } = useParams();
  
  const isEditing = !!id;
  const payableToEdit = isEditing ? context?.payables.find(p => p.id === id) : null;

  const [personName, setPersonName] = useState(isEditing ? payableToEdit?.personName || '' : '');
  const [amount, setAmount] = useState<number | ''>(isEditing ? payableToEdit?.amount || '' : '');
  const [date, setDate] = useState(isEditing ? payableToEdit?.date.split('T')[0] || '' : new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState(isEditing ? payableToEdit?.notes || '' : '');
  
  useEffect(() => {
    if (isEditing && payableToEdit) {
      setPersonName(payableToEdit.personName);
      setAmount(payableToEdit.amount);
      setDate(payableToEdit.date.split('T')[0]);
      setNotes(payableToEdit.notes || '');
    }
  }, [isEditing, payableToEdit]);

  if (!context) return null;
  
  const { addPayable, updatePayable } = context;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (personName && amount && date) {
      const payableData = {
        personName,
        amount: +amount,
        date: new Date(date).toISOString(),
        notes,
      };
      if (isEditing && payableToEdit) {
        updatePayable({ ...payableToEdit, ...payableData });
      } else {
        addPayable(payableData);
      }
      navigate('/payables');
    } else {
      alert("Please fill name, amount and date.");
    }
  };

  return (
    <div className="p-4">
      <header className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
              <ArrowLeft />
          </button>
          <h1 className="text-2xl font-bold">{isEditing ? 'Edit Payable' : 'Add Payable'}</h1>
      </header>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="personName" className="block text-sm font-medium text-gray-500 dark:text-gray-400">Payable to (Person/Shop Name)</label>
          <input
            id="personName"
            type="text"
            value={personName}
            onChange={(e) => setPersonName(e.target.value)}
            placeholder="e.g., Car Repair Shop"
            className="mt-1 w-full bg-gray-100 dark:bg-gray-800 border-transparent focus:ring-primary focus:border-primary rounded-lg py-2"
            required
          />
        </div>
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-500 dark:text-gray-400">Amount</label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value ? parseFloat(e.target.value) : '')}
            placeholder="0.00"
            className="mt-1 w-full bg-gray-100 dark:bg-gray-800 border-transparent focus:ring-primary focus:border-primary rounded-lg py-2"
            required
          />
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
            placeholder="e.g., For engine oil change"
          />
        </div>
        
        <div className="pt-4">
            <button type="submit" className="w-full text-white bg-gradient-to-br from-primary to-accent font-semibold py-3 px-4 rounded-lg shadow-lg hover:opacity-90 transition-opacity">
                {isEditing ? 'Update Payable' : 'Save Payable'}
            </button>
        </div>
      </form>
    </div>
  );
};

export default AddPayable;
