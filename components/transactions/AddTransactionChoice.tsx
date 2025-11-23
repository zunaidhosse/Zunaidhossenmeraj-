
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import Card from '../ui/Card';

const AddTransactionChoice: React.FC = () => {
  return (
    <div className="p-4 h-[calc(100vh-5rem)] flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold text-center mb-8">What would you like to add?</h1>
      <div className="w-full max-w-xs space-y-6">
        <Link to="/add/income" className="block text-decoration-none">
          <Card className="text-center p-8 transition-transform transform hover:scale-105 hover:shadow-2xl cursor-pointer border-2 border-green-500/50">
            <ArrowUpCircle className="mx-auto text-green-500 mb-4" size={48} />
            <h2 className="text-xl font-semibold text-green-500">Add Income</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Record money you've earned.</p>
          </Card>
        </Link>
        
        <Link to="/add/expense" className="block text-decoration-none">
          <Card className="text-center p-8 transition-transform transform hover:scale-105 hover:shadow-2xl cursor-pointer border-2 border-red-500/50">
            <ArrowDownCircle className="mx-auto text-red-500 mb-4" size={48} />
            <h2 className="text-xl font-semibold text-red-500">Add Expense</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Track where your money went.</p>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default AddTransactionChoice;
