
import React, { useContext, useState } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import Card from '../ui/Card';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1943', '#19FFB5'];

const MonthlyReport: React.FC = () => {
    const context = useContext(AppContext);
    const [month, setMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM

    if (!context) return null;

    const { transactions, settings } = context;

    const filteredTransactions = transactions.filter(t => t.date.startsWith(month));
    
    const expenseData = filteredTransactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
            const existing = acc.find(item => item.name === t.category.name);
            if (existing) {
                existing.value += t.amount;
            } else {
                acc.push({ name: t.category.name, value: t.amount });
            }
            return acc;
        }, [] as { name: string; value: number }[]);

    const totalIncome = filteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const savings = totalIncome - totalExpense;
    
    const incomeExpenseData = [{ name: 'Income', value: totalIncome }, { name: 'Expense', value: totalExpense }];

    return (
        <div className="p-4 space-y-6">
            <h1 className="text-2xl font-bold">Monthly Report</h1>
            <input 
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full bg-gray-100 dark:bg-gray-800 border-transparent focus:ring-primary focus:border-primary rounded-lg py-2 px-3"
            />
            
            <Card>
                <h2 className="font-semibold mb-4">Expense Breakdown</h2>
                {expenseData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie data={expenseData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                                {expenseData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                ) : <p className="text-center text-gray-500">No expense data for this month.</p>}
            </Card>
            
            <Card>
                <h2 className="font-semibold mb-4">Income vs Expense</h2>
                 <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={incomeExpenseData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" >
                        {incomeExpenseData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={index === 0 ? '#00C49F' : '#FF8042'} />
                        ))}
                      </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </Card>

            <Card>
                <h2 className="font-semibold mb-2">Monthly Summary</h2>
                <div className="space-y-2">
                    <div className="flex justify-between"><span>Total Income:</span> <span className="font-semibold text-green-500">{totalIncome.toLocaleString()} {settings.currency}</span></div>
                    <div className="flex justify-between"><span>Total Expense:</span> <span className="font-semibold text-red-500">{totalExpense.toLocaleString()} {settings.currency}</span></div>
                    <hr className="border-gray-200 dark:border-gray-700 my-1"/>
                    <div className="flex justify-between"><span>Savings:</span> <span className={`font-semibold ${savings >= 0 ? 'text-blue-500' : 'text-orange-500'}`}>{savings.toLocaleString()} {settings.currency}</span></div>
                </div>
            </Card>
        </div>
    );
};

export default MonthlyReport;
