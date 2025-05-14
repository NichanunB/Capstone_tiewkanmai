import React from 'react';

function Sidebar({ filters, onFilterChange }) {
  const filterCategories = [
    { key: 'ย่านจีน', label: 'ย่านจีน' },
    { key: 'ช้อปปิ้ง', label: 'ช้อปปิ้ง' },
    { key: 'วัดวาอาราม', label: 'วัดวาอาราม' },
    { key: 'คาเฟ่', label: 'คาเฟ่' },
    { key: 'ย่าน', label: 'ย่าน' },
    { key: 'อื่นๆ', label: 'อื่นๆ' },
  ];

  return (
    <aside className="w-64 bg-white p-4 shadow-md">
      <h2 className="text-lg font-semibold mb-4">ตัวกรอง</h2>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {Object.entries(filters).map(([key, value]) => (
          value && (
            <div key={key} className="flex items-center bg-blue-100 px-2 py-1 rounded-md">
              <span>{key}</span>
              <button 
                onClick={() => onFilterChange(key)}
                className="ml-1 text-blue-500"
              >
                ×
              </button>
            </div>
          )
        ))}
      </div>
      
      <div>
        {filterCategories.map(category => (
          <div key={category.key} className="mb-2">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={filters[category.key] || false}
                onChange={() => onFilterChange(category.key)}
                className="mr-2 form-checkbox h-5 w-5 text-blue-600"
              />
              <span>{category.label}</span>
            </label>
          </div>
        ))}
      </div>
    </aside>
  );
}

export default Sidebar