import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import useExpenses from './hooks/useExpenses';
import AddExpenseForm from './components/AddExpenseForm';
import EditExpenseForm from './components/EditExpenseForm';
import ExpenseList from './components/ExpenseList';
import Dashboard from './components/Dashboard';
import MonthSelector from './components/MonthSelector';
import SettingsScreen from './components/SettingsScreen';
import './styles/index.css';

function App() {
  const { 
    expenses, 
    addExpense, 
    updateExpense, 
    deleteExpense, 
    getTotalByCategory, 
    getRecentExpenses, 
    getCategories, 
    addCategory, 
    deleteCategory,
    monthFilter,
    setMonthFilter,
    getExpensesForMonth,
    getTotalForMonth
  } = useExpenses();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('dashboard'); // 'dashboard', 'addExpense', 'settings'

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
  const categories = getCategories();
  
  // Get expenses and total for the selected month
  const monthExpenses = getExpensesForMonth(monthFilter);
  const monthTotal = getTotalForMonth(monthFilter);

  const renderContent = () => {
    switch (currentScreen) {
      case 'addExpense':
        return (
          <div className="max-w-md mx-auto">
            <AddExpenseForm onSubmit={handleAddExpense} isSubmitting={isSubmitting} categories={categories} />
          </div>
        );
      case 'settings':
        return (
          <div className="max-w-2xl mx-auto">
            <SettingsScreen categories={categories} onAddCategory={addCategory} onDeleteCategory={deleteCategory} />
          </div>
        );
      case 'dashboard':
      default:
        return (
          <>
            <MonthSelector selectedMonth={monthFilter} onMonthChange={setMonthFilter} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <AddExpenseForm onSubmit={handleAddExpense} isSubmitting={isSubmitting} categories={categories} />
              </div>

              <div className="lg:col-span-2">
                <Dashboard 
                  expenses={recentExpenses} 
                  totalByCategory={totalByCategory}
                  monthExpenses={monthExpenses}
                  monthTotal={monthTotal}
                />
                <h2 className="text-xl font-bold text-gray-800 mb-4">Expenses for {monthFilter.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h2>
                <ExpenseList expenses={monthExpenses} onDelete={deleteExpense} onEdit={handleEditExpense} />
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Expense Tracker</h1>
        <p className="text-gray-600 mb-6">Track your spending and manage your budget</p>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8 border-b border-gray-300">
          <button
            onClick={() => setCurrentScreen('dashboard')}
            className={`py-2 px-4 font-medium transition duration-200 ${
              currentScreen === 'dashboard'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setCurrentScreen('addExpense')}
            className={`py-2 px-4 font-medium transition duration-200 ${
              currentScreen === 'addExpense'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Add Expense
          </button>
          <button
            onClick={() => setCurrentScreen('settings')}
            className={`py-2 px-4 font-medium transition duration-200 ${
              currentScreen === 'settings'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Settings
          </button>
        </div>

        {renderContent()}
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
