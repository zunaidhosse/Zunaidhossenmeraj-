
import React, { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { FileDown, RefreshCw, X, HelpCircle } from 'lucide-react';

interface AdminPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
    const context = useContext(AppContext);
    if (!context) return null;

    const { resetData, transactions } = context;

    const handleReset = () => {
        if (window.confirm('Are you sure you want to reset all data? This cannot be undone.')) {
            resetData();
            onClose();
        }
    };
    
    const exportToCSV = () => {
        const headers = "ID,Type,Amount,Category,Date,Notes\n";
        const csvContent = transactions.map(t => 
            `${t.id},${t.type},${t.amount},${t.category.name},${t.date},"${t.notes || ''}"`
        ).join("\n");
        
        const blob = new Blob([headers + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", "transactions.csv");
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-light-bg dark:bg-dark-bg rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Admin Panel</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                        <X />
                    </button>
                </div>
                <div className="space-y-3">
                     <button onClick={exportToCSV} className="w-full flex items-center justify-center gap-2 text-white bg-blue-500 hover:bg-blue-600 font-semibold py-3 px-4 rounded-lg transition-colors">
                        <FileDown size={20} /> Export as CSV
                    </button>
                    <a href="https://zunaidhosse.github.io/My-contact/" target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 text-white bg-green-500 hover:bg-green-600 font-semibold py-3 px-4 rounded-lg transition-colors">
                        <HelpCircle size={20} /> Help Line
                    </a>
                    <button onClick={handleReset} className="w-full flex items-center justify-center gap-2 text-white bg-red-500 hover:bg-red-600 font-semibold py-3 px-4 rounded-lg transition-colors">
                        <RefreshCw size={20} /> Reset Full Data
                    </button>
                </div>
                <p className="text-xs text-gray-500 text-center">These are powerful actions. Use with caution.</p>
            </div>
        </div>
    );
};

export default AdminPanel;