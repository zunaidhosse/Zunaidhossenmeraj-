import React, { useContext, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AppContext } from '../../contexts/AppContext';
import { ArrowLeft, Edit, Trash2, PlusCircle, CheckCircle } from 'lucide-react';
import Card from '../ui/Card';

const PayableDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const context = useContext(AppContext);
    
    const [paymentAmount, setPaymentAmount] = useState<number | ''>('');
    const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
    const [paymentNotes, setPaymentNotes] = useState('');

    const payable = context?.payables.find(p => p.id === id);

    if (!context || !payable) {
        return (
            <div className="p-4 text-center">
                <p>Payable not found.</p>
                <button onClick={() => navigate('/payables')} className="mt-4 text-primary">Go Back</button>
            </div>
        );
    }

    const { deletePayable, addPaymentMade, settings } = context;
    
    const paidAmount = (payable.paymentsMade || []).reduce((sum, p) => sum + p.amount, 0);
    const remainingAmount = payable.amount - paidAmount;
    const progress = payable.amount > 0 ? (paidAmount / payable.amount) * 100 : 100;

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this payable record? This cannot be undone.')) {
            deletePayable(payable.id);
            navigate('/payables');
        }
    };
    
    const handleAddPayment = (e: React.FormEvent) => {
        e.preventDefault();
        if (paymentAmount && paymentAmount > 0 && paymentAmount <= remainingAmount) {
            addPaymentMade(payable.id, {
                amount: +paymentAmount,
                date: new Date(paymentDate).toISOString(),
                notes: paymentNotes
            });
            setPaymentAmount('');
            setPaymentNotes('');
        } else {
            alert(`Please enter a valid amount (up to ${remainingAmount.toLocaleString()}).`);
        }
    };
    
    return (
        <div className="p-4 space-y-6 pb-20">
            <header className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                        <ArrowLeft />
                    </button>
                    <h1 className="text-xl font-bold truncate">{payable.personName}</h1>
                </div>
                 <div className="flex items-center gap-2">
                    <Link to={`/payables/edit/${payable.id}`} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                        <Edit size={20} />
                    </Link>
                    <button onClick={handleDelete} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-red-500">
                        <Trash2 size={20} />
                    </button>
                </div>
            </header>
            
            <Card>
                <div className="space-y-3">
                    <div className="text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Remaining Amount Due</p>
                        <p className="text-4xl font-bold text-orange-500">{remainingAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })} {settings.currency}</p>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div className="bg-gradient-to-r from-green-400 to-blue-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-green-500">Paid: {paidAmount.toLocaleString()}</span>
                        <span className="text-gray-500 dark:text-gray-400">Total: {payable.amount.toLocaleString()}</span>
                    </div>
                </div>
            </Card>
            
            {payable.status === 'due' && (
                 <Card>
                    <h3 className="font-semibold mb-4 text-lg">Record a Payment Made</h3>
                    <form onSubmit={handleAddPayment} className="space-y-4">
                         <div>
                            <label htmlFor="paymentAmount" className="block text-sm font-medium text-gray-500 dark:text-gray-400">Amount</label>
                            <input
                                id="paymentAmount"
                                type="number"
                                value={paymentAmount}
                                onChange={(e) => setPaymentAmount(e.target.value ? parseFloat(e.target.value) : '')}
                                placeholder="0.00"
                                max={remainingAmount}
                                step="any"
                                className="mt-1 w-full bg-gray-100 dark:bg-gray-800 border-transparent focus:ring-primary focus:border-primary rounded-lg py-2"
                                required
                            />
                        </div>
                        <div>
                           <label htmlFor="paymentDate" className="block text-sm font-medium text-gray-500 dark:text-gray-400">Date</label>
                            <input
                                id="paymentDate"
                                type="date"
                                value={paymentDate}
                                onChange={(e) => setPaymentDate(e.target.value)}
                                className="mt-1 w-full bg-gray-100 dark:bg-gray-800 border-transparent focus:ring-primary focus:border-primary rounded-lg py-2"
                                required
                            />
                        </div>
                         <div>
                            <label htmlFor="paymentNotes" className="block text-sm font-medium text-gray-500 dark:text-gray-400">Notes (Optional)</label>
                            <input
                                id="paymentNotes"
                                type="text"
                                value={paymentNotes}
                                onChange={(e) => setPaymentNotes(e.target.value)}
                                className="mt-1 w-full bg-gray-100 dark:bg-gray-800 border-transparent focus:ring-primary focus:border-primary rounded-lg py-2"
                            />
                        </div>
                        <button type="submit" className="w-full flex items-center justify-center gap-2 text-white bg-primary font-semibold py-3 px-4 rounded-lg transition-colors hover:opacity-90">
                            <PlusCircle size={20} /> Record Payment
                        </button>
                    </form>
                 </Card>
            )}
            
            <Card>
                <h3 className="font-semibold mb-2 text-lg">Payment History</h3>
                {(payable.paymentsMade || []).length > 0 ? (
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        {[...(payable.paymentsMade || [])].reverse().map(p => (
                            <li key={p.id} className="py-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-semibold">{p.amount.toLocaleString()} {settings.currency}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(p.date).toLocaleDateString()}</p>
                                    </div>
                                    <CheckCircle className="text-green-500" />
                                </div>
                                {p.notes && <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 italic">"{p.notes}"</p>}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center text-gray-500 py-4">No payments made yet.</p>
                )}
            </Card>
        </div>
    );
};

export default PayableDetail;
