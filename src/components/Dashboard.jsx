import React from 'react';

const Dashboard = ({ expenses, totalByCategory }) => {
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const categories = Object.keys(totalByCategory).sort(
    (a, b) => totalByCategory[b] - totalByCategory[a]
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Summary</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white">
          <p className="text-sm font-medium opacity-90">Total Expenses</p>
          <p className="text-3xl font-bold">${totalExpenses.toFixed(2)}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-4 text-white">
          <p className="text-sm font-medium opacity-90">Total Transactions</p>
          <p className="text-3xl font-bold">{expenses.length}</p>
        </div>
      </div>

      {categories.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">By Category</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category} className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-700">{category}</span>
                <span className="font-semibold text-gray-900">
                  ${totalByCategory[category].toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
