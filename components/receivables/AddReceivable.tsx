import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../../contexts/AppContext';
import { ArrowLeft } from 'lucide-react';

const AddReceivable: React.FC = () => {
  const context = useContext(AppContext);
  const navigate = useNavigate();
  const { id } = useParams();
  
  const isEditing = !!id;
  const receivableToEdit = isEditing ? context?.receivables.find(r => r.id === id) : null;

  const [personName, setPersonName] = useState(isEditing ? receivableToEdit?.personName || '' : '');
  const [amount, setAmount] = useState<number | ''>(isEditing ? receivableToEdit?.amount || '' : '');
  const [date, setDate] = useState(isEditing ? receivableToEdit?.date.split('T')[0] || '' : new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState(isEditing ? receivableToEdit?.notes || '' : '');
  
  useEffect(() => {
    if (isEditing && receivableToEdit) {
      setPersonName(receivableToEdit.personName);
      setAmount(receivableToEdit.amount);
      setDate(receivableToEdit.date.split('T')[0]);
      setNotes(receivableToEdit.notes || '');
    }
  }, [isEditing, receivableToEdit]);

  if (!context) return null;
  
  const { addReceivable, updateReceivable } = context;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (personName && amount && date) {
      const receivableData = {
        personName,
        amount: +amount,
        date: new Date(date).toISOString(),
        notes,
      };
      if (isEditing && receivableToEdit) {
        updateReceivable({ ...receivableToEdit, ...receivableData });
      } else {
        addReceivable(receivableData);
      }
      navigate('/receivables');
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
          <h1 className="text-2xl font-bold">{isEditing ? 'Edit Receivable' : 'Add Receivable'}</h1>
      </header>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="personName" className="block text-sm font-medium text-gray-500 dark:text-gray-400">Person's Name</label>
          <input
            id="personName"
            type="text"
            value={personName}
            onChange={(e) => setPersonName(e.target.value)}
            placeholder="e.g., John Doe"
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
            placeholder="e.g., For last week's trip"
          />
        </div>
        
        <div className="pt-4">
            <button type="submit" className="w-full text-white bg-gradient-to-br from-primary to-accent font-semibold py-3 px-4 rounded-lg shadow-lg hover:opacity-90 transition-opacity">
                {isEditing ? 'Update Receivable' : 'Save Receivable'}
            </button>
        </div>
      </form>
    </div>
  );
};

export default AddReceivable;
