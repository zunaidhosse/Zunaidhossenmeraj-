
import React, { useContext, useState } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { ChevronRight, Sun, Moon } from 'lucide-react';
import Card from '../ui/Card';

const Settings: React.FC = () => {
  const context = useContext(AppContext);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('💡');
  
  if (!context) return null;
  
  const { settings, updateSettings, categories, addCategory } = context;

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if(newCategoryName.trim() !== '' && newCategoryIcon.trim() !== ''){
        addCategory({ name: newCategoryName, icon: newCategoryIcon });
        setNewCategoryName('');
        setNewCategoryIcon('💡');
    }
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <Card>
        <h2 className="font-semibold mb-4">Preferences</h2>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
            <div className="flex justify-between items-center py-3">
                <span>Dark Mode</span>
                <button onClick={() => updateSettings({ darkMode: !settings.darkMode })} className="p-2 rounded-full bg-gray-200 dark:bg-gray-700">
                    {settings.darkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
            </div>
            <div className="flex justify-between items-center py-3">
                <span>Currency</span>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <span>{settings.currency}</span>
                    <ChevronRight size={20} />
                </div>
            </div>
             <div className="py-3">
                <label htmlFor="spending-limit" className="block mb-2">Today's Spending Limit ({settings.currency})</label>
                <input
                    id="spending-limit"
                    type="number"
                    value={settings.spendingLimit || ''}
                    onChange={e => updateSettings({ spendingLimit: e.target.value ? Number(e.target.value) : null })}
                    placeholder="No limit"
                    className="w-full bg-gray-100 dark:bg-gray-800 border-transparent rounded-lg py-2 px-3"
                />
            </div>
        </div>
      </Card>

      <Card>
        <h2 className="font-semibold mb-4">Manage Categories</h2>
        <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
            {categories.filter(c => c.id !== 'income').map(cat => (
                <div key={cat.id} className="flex items-center gap-3 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <span className="text-xl">{cat.icon}</span>
                    <span>{cat.name}</span>
                </div>
            ))}
        </div>
        <form onSubmit={handleAddCategory} className="flex gap-2">
            <input type="text" value={newCategoryIcon} onChange={e => setNewCategoryIcon(e.target.value)} maxLength={2} className="w-12 text-center bg-gray-100 dark:bg-gray-800 rounded-lg p-2"/>
            <input type="text" value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} placeholder="New category name" className="flex-grow bg-gray-100 dark:bg-gray-800 rounded-lg p-2" required/>
            <button type="submit" className="bg-primary text-white font-semibold px-4 rounded-lg">Add</button>
        </form>
      </Card>
      
      <Card>
        <h2 className="font-semibold mb-4">Data & Sync</h2>
        <div className="space-y-2">
            <button className="w-full text-left p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">Cloud Backup (Coming Soon)</button>
            <button className="w-full text-left p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">Restore from Backup (Coming Soon)</button>
        </div>
      </Card>
    </div>
  );
};

export default Settings;
