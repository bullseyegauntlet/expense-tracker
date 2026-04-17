import { useState, useEffect } from 'react';

const PRESET_CATEGORIES = ['Food', 'Transport', 'Rent', 'Entertainment', 'Other'];

const useExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [settings, setSettings] = useState({ categories: [...PRESET_CATEGORIES] });

  // Load from localStorage on mount
  useEffect(() => {
    const storedExpenses = localStorage.getItem('expenses');
    if (storedExpenses) {
      try {
        setExpenses(JSON.parse(storedExpenses));
      } catch (error) {
        console.error('Failed to parse expenses from localStorage:', error);
      }
    }

    const storedSettings = localStorage.getItem('expenseTrackerSettings');
    if (storedSettings) {
      try {
        setSettings(JSON.parse(storedSettings));
      } catch (error) {
        console.error('Failed to parse settings from localStorage:', error);
      }
    }
  }, []);

  // Save to localStorage whenever expenses change
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('expenseTrackerSettings', JSON.stringify(settings));
  }, [settings]);

  const addExpense = (amount, category, date, note) => {
    // Validate amount > 0
    if (!amount || parseFloat(amount) <= 0) {
      throw new Error('Amount must be greater than 0');
    }

    // Validate category is selected
    if (!category || category.trim() === '') {
      throw new Error('Category must be selected');
    }

    // Create new expense with ID
    const newExpense = {
      id: Date.now(),
      amount: parseFloat(amount),
      category,
      date,
      note: note || '',
    };

    // Add to state
    setExpenses((prevExpenses) => [newExpense, ...prevExpenses]);

    return newExpense;
  };

  const getRecentExpenses = (limit = 10) => {
    // Return sorted by date descending
    return expenses
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit);
  };

  const deleteExpense = (id) => {
    setExpenses((prevExpenses) =>
      prevExpenses.filter((expense) => expense.id !== id)
    );
  };

  const getTotalByCategory = () => {
    const totals = {};
    expenses.forEach((expense) => {
      totals[expense.category] = (totals[expense.category] || 0) + expense.amount;
    });
    return totals;
  };

  const updateExpense = (id, data) => {
    // Validate amount > 0
    if (!data.amount || parseFloat(data.amount) <= 0) {
      throw new Error('Amount must be greater than 0');
    }

    // Validate category is selected
    if (!data.category || data.category.trim() === '') {
      throw new Error('Category must be selected');
    }

    // Update expense in state
    setExpenses((prevExpenses) =>
      prevExpenses.map((expense) =>
        expense.id === id
          ? {
              ...expense,
              amount: parseFloat(data.amount),
              category: data.category,
              date: data.date,
              note: data.note || '',
            }
          : expense
      )
    );
  };

  const addCategory = (name) => {
    // Validate input
    if (!name || name.trim() === '') {
      throw new Error('Category name cannot be empty');
    }

    const trimmedName = name.trim();

    // Check for duplicates (case-insensitive)
    if (settings.categories.some((cat) => cat.toLowerCase() === trimmedName.toLowerCase())) {
      throw new Error('Category already exists');
    }

    // Add new category
    setSettings((prevSettings) => ({
      ...prevSettings,
      categories: [...prevSettings.categories, trimmedName],
    }));
  };

  const deleteCategory = (name) => {
    // Don't allow deletion of preset categories
    if (PRESET_CATEGORIES.includes(name)) {
      throw new Error('Cannot delete preset categories');
    }

    setSettings((prevSettings) => ({
      ...prevSettings,
      categories: prevSettings.categories.filter((cat) => cat !== name),
    }));
  };

  const getCategories = () => {
    return settings.categories;
  };

  return {
    expenses,
    addExpense,
    getRecentExpenses,
    deleteExpense,
    updateExpense,
    getTotalByCategory,
    addCategory,
    deleteCategory,
    getCategories,
  };
};

export default useExpenses;
