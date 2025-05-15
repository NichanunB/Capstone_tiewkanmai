import React from 'react';

const ResultTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'attraction', label: 'ที่ท่องเที่ยว' },
    { id: 'restaurant', label: 'ร้านอาหาร' },
    { id: 'plan', label: 'แผนเที่ยว' },
  ];

  return (
    <div className="flex -mb-px">
      {tabs.map((tab, idx) => (
        <button
          key={tab.id}
          className={`px-6 py-2 font-medium border border-b-0 transition-all cursor-pointer
            ${activeTab === tab.id
              ? 'bg-[#3674B5] text-white z-10 rounded-t-lg'
              : 'bg-gray-100 text-gray-500 border-gray-300 z-0 rounded-t-lg'}
            ${idx === 0 ? 'ml-0' : '-ml-px'}
          `}
          style={{ position: 'relative', top: activeTab === tab.id ? '2px' : '6px' }}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default ResultTabs;
