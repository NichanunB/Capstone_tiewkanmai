import React from 'react';

export default function Filters({ selectedFilters, filters, onFilterChange }) {
  const handleCheckboxChange = (filterId) => {
    if (selectedFilters.includes(filterId)) {
      // Remove filter if already selected
      onFilterChange(selectedFilters.filter(id => id !== filterId));
    } else {
      // Add filter if not selected
      onFilterChange([...selectedFilters, filterId]);
    }
  };

  const handleRemoveFilter = (filterId) => {
    onFilterChange(selectedFilters.filter(id => id !== filterId));
  };

  return (
    <div className="w-64 bg-white p-4 rounded-lg shadow-sm">
      <h2 className="text-lg font-medium mb-4">ตัวกรอง</h2>

      {/* Filter pills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {selectedFilters.map(filterId => {
          const filter = filters.find(f => f.id === filterId);
          return (
            <div key={filterId} className="flex items-center bg-[#3674B5] text-white px-2 py-1 rounded-lg text-sm">
              {filter?.label || filterId}
              <span 
                className="ml-1 cursor-pointer" 
                onClick={() => handleRemoveFilter(filterId)}
              >
                ×
              </span>
            </div>
          );
        })}
      </div>

      {/* Filter checkboxes */}
      <div className="space-y-2">
        {filters.map(filter => (
          <div key={filter.id} className="flex items-center">
            <input 
              type="checkbox" 
              id={filter.id} 
              className="mr-2 cursor-pointer"
              checked={selectedFilters.includes(filter.id)}
              onChange={() => handleCheckboxChange(filter.id)}
            />
            <label htmlFor={filter.id} className="cursor-pointer">{filter.label}</label>
          </div>
        ))}
      </div>
    </div>
  );
}
