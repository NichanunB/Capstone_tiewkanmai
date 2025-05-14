import React from 'react';

export default function Filters({ selectedFilters, filters }) {
  return (
    <div className="w-64 bg-white p-4 rounded-lg shadow-sm">
      <h2 className="text-lg font-medium mb-4">ตัวกรอง</h2>

      {/* Filter pills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {selectedFilters.map(filter => (
          <div key={filter} className="flex items-center bg-[#3674B5] text-white px-2 py-1 rounded-lg text-sm">
            {filter} 
            <span className="ml-1 cursor-pointer">×</span>
          </div>
        ))}
      </div>

      {/* Filter checkboxes */}
      <div className="space-y-2">
        {filters.map(filter => (
          <div key={filter.id} className="flex items-center">
            <input 
              type="checkbox" 
              id={filter.id} 
              className="mr-2"
              defaultChecked={selectedFilters.includes(filter.id)}
            />
            <label htmlFor={filter.id}>{filter.label}</label>
          </div>
        ))}
      </div>
    </div>
  );
}
