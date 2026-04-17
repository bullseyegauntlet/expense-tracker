import React, { useState } from 'react';

const ExpenseList = ({ expenses, onDelete, onEdit }) => {
  const [confirmDelete, setConfirmDelete] = useState(null);

  const handleDeleteClick = (expense) => {
    setConfirmDelete(expense);
  };

  const handleConfirmDelete = () => {
    if (confirmDelete) {
      onDelete(confirmDelete.id);
      setConfirmDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDelete(null);
  };

  if (expenses.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No expenses yet. Add your first expense above!</p>
      </div>
    );
  }

  // Sort by date (newest first) — already should be sorted from getRecentExpenses, but ensure it here
  const sortedExpenses = [...expenses].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  // Format date helper
  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    } catch {
      return dateStr;
    }
  };

  // Truncate note to 50 chars
  const truncateNote = (note, maxLength = 50) => {
    if (!note || note.trim() === '') return '—';
    return note.length > maxLength ? note.substring(0, maxLength) + '...' : note;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Desktop: Table layout with scrollable body */}
      <div className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-300 sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Category</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Note</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 max-h-96 overflow-y-auto block">
              {sortedExpenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-gray-50 table w-full table-fixed">
                  <td className="px-4 py-3 text-sm text-gray-800 w-24">{formatDate(expense.date)}</td>
                  <td className="px-4 py-3 text-sm w-32">
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium whitespace-nowrap">
                      {expense.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900 w-24">
                    ${expense.amount.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 truncate flex-1" title={expense.note}>
                    {truncateNote(expense.note)}
                  </td>
                  <td className="px-4 py-3 text-center text-sm w-32">
                    <button
                      onClick={() => onEdit(expense)}
                      className="text-blue-500 hover:text-blue-700 font-medium text-xs transition-colors mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(expense)}
                      className="text-red-500 hover:text-red-700 font-medium text-xs transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile: Stacked card layout */}
      <div className="md:hidden">
        <div className="max-h-96 overflow-y-auto">
          {sortedExpenses.map((expense) => (
            <div
              key={expense.id}
              className="px-4 py-4 border-b border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-xs text-gray-500 font-medium">{formatDate(expense.date)}</p>
                  <p className="text-lg font-bold text-gray-900">${expense.amount.toFixed(2)}</p>
                </div>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                  {expense.category}
                </span>
              </div>
              {expense.note && (
                <p className="text-sm text-gray-600 mb-3 truncate">{truncateNote(expense.note)}</p>
              )}
              <div className="flex gap-3">
                <button
                  onClick={() => onEdit(expense)}
                  className="text-blue-500 hover:text-blue-700 font-medium text-xs transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteClick(expense)}
                  className="text-red-500 hover:text-red-700 font-medium text-xs transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-4/5">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Expense?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this expense? <strong>${confirmDelete.amount.toFixed(2)}</strong> from <strong>{confirmDelete.category}</strong>. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md font-medium text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md font-medium text-sm transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseList;
