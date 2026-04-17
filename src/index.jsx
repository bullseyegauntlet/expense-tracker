import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import useExpenses from './hooks/useExpenses';
import AddExpenseForm from './components/AddExpenseForm';
import EditExpenseForm from './components/EditExpenseForm';
import ExpenseList from './components/ExpenseList';
import Dashboard from './components/Dashboard';
import './styles/index.css';

function App() {
  const { expenses, addExpense, updateExpense, deleteExpense, getTotalByCategory, getRecentExpenses } = useExpenses();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  const handleAddExpense = async (formData) => {
    setIsSubmitting(true);
    try {
      // Simulate async operation (can be replaced with actual API call)
      await new Promise((resolve) => setTimeout(resolve, 300));
      addExpense(formData.amount, formData.category, formData.date, formData.note);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
  };

  const handleSaveEdit = async (updatedData) => {
    setIsSubmitting(true);
    try {
      // Simulate async operation (can be replaced with actual API call)
      await new Promise((resolve) => setTimeout(resolve, 300));
      updateExpense(updatedData.id, {
        amount: updatedData.amount,
        category: updatedData.category,
        date: updatedData.date,
        note: updatedData.note,
      });
      setEditingExpense(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingExpense(null);
  };

  const totalByCategory = getTotalByCategory();
  const recentExpenses = getRecentExpenses(10);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Expense Tracker</h1>
        <p className="text-gray-600 mb-8">Track your spending and manage your budget</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <AddExpenseForm onSubmit={handleAddExpense} isSubmitting={isSubmitting} />
          </div>

          <div className="lg:col-span-2">
            <Dashboard expenses={recentExpenses} totalByCategory={totalByCategory} />
            <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Expenses</h2>
            <ExpenseList expenses={recentExpenses} onDelete={deleteExpense} onEdit={handleEditExpense} />
          </div>
        </div>
      </div>
      {editingExpense && (
        <EditExpenseForm
          expense={editingExpense}
          onSubmit={handleSaveEdit}
          onCancel={handleCancelEdit}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
