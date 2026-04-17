import React, { useState } from 'react';

const PRESET_CATEGORIES = ['Food', 'Transport', 'Rent', 'Entertainment', 'Other'];

const SettingsScreen = ({ categories, onAddCategory, onDeleteCategory }) => {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAddCategory = () => {
    setError('');
    setSuccess('');

    // Validate empty
    if (!newCategoryName || newCategoryName.trim() === '') {
      setError('Category name cannot be empty');
      return;
    }

    // Validate no duplicates
    if (
      categories.some(
        (cat) => cat.toLowerCase() === newCategoryName.trim().toLowerCase()
      )
    ) {
      setError('Category already exists');
      return;
    }

    try {
      onAddCategory(newCategoryName.trim());
      setSuccess(`Category "${newCategoryName.trim()}" added successfully!`);
      setNewCategoryName('');
    } catch (err) {
      setError(err.message || 'Failed to add category');
    }
  };

  const handleDeleteCategory = (categoryName) => {
    try {
      onDeleteCategory(categoryName);
      setSuccess(`Category "${categoryName}" deleted successfully!`);
    } catch (err) {
      setError(err.message || 'Failed to delete category');
    }
  };

  const isPreset = (categoryName) => PRESET_CATEGORIES.includes(categoryName);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Settings</h2>

      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          Manage Categories
        </h3>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {success}
          </div>
        )}

        <div className="mb-6">
          <label htmlFor="newCategory" className="block text-sm font-medium text-gray-700 mb-2">
            Add New Category
          </label>
          <div className="flex gap-2">
            <input
              id="newCategory"
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Enter category name"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddCategory();
                }
              }}
            />
            <button
              onClick={handleAddCategory}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition duration-200"
            >
              Add Category
            </button>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Existing Categories</h4>
          <div className="space-y-2">
            {categories.map((category) => (
              <div
                key={category}
                className="flex items-center justify-between bg-gray-50 p-3 rounded-md border border-gray-200"
              >
                <div className="flex items-center gap-2">
                  <span className="text-gray-700 font-medium">{category}</span>
                  {isPreset(category) && (
                    <span className="text-xs bg-gray-300 text-gray-700 px-2 py-1 rounded">
                      Preset
                    </span>
                  )}
                </div>
                {!isPreset(category) && (
                  <button
                    onClick={() => handleDeleteCategory(category)}
                    className="text-red-600 hover:text-red-800 font-medium text-sm transition duration-200"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;
