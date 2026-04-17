import React from 'react';

const MonthSelector = ({ selectedMonth, onMonthChange }) => {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePreviousMonth = () => {
    const newDate = new Date(selectedMonth);
    newDate.setMonth(newDate.getMonth() - 1);
    onMonthChange(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(selectedMonth);
    newDate.setMonth(newDate.getMonth() + 1);
    onMonthChange(newDate);
  };

  const currentMonthName = monthNames[selectedMonth.getMonth()];
  const currentYear = selectedMonth.getFullYear();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between">
        <button
          onClick={handlePreviousMonth}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium text-gray-700 transition-colors"
        >
          ← Previous
        </button>
        
        <h2 className="text-2xl font-bold text-gray-800">
          {currentMonthName} {currentYear}
        </h2>
        
        <button
          onClick={handleNextMonth}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium text-gray-700 transition-colors"
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default MonthSelector;
