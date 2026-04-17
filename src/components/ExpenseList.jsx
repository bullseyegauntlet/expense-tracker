import React from 'react';

const ExpenseList = ({ expenses, onDelete }) => {
  if (expenses.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No expenses yet. Add your first expense above!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-100 border-b border-gray-300">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Date</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Category</th>
            <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">Amount</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Note</th>
            <th className="px-6 py-3 text-center text-sm font-medium text-gray-700">Action</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense.id} className="border-b border-gray-200 hover:bg-gray-50">
              <td className="px-6 py-3 text-sm text-gray-800">{expense.date}</td>
              <td className="px-6 py-3 text-sm">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                  {expense.category}
                </span>
              </td>
              <td className="px-6 py-3 text-sm text-right font-semibold text-gray-900">
                ${expense.amount.toFixed(2)}
              </td>
              <td className="px-6 py-3 text-sm text-gray-600 max-w-xs truncate">
                {expense.note || '—'}
              </td>
              <td className="px-6 py-3 text-center text-sm">
                <button
                  onClick={() => onDelete(expense.id)}
                  className="text-red-500 hover:text-red-700 font-medium text-xs"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExpenseList;
