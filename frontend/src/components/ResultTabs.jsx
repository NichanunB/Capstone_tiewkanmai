export default function ResultTabs({ tabs, activeTab, onTabChange }) {
    return (
      <div className="flex border-b">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`px-6 py-2 font-medium ${activeTab === tab.id 
              ? 'text-white bg-[#3674B5] rounded-t-lg' 
              : 'text-gray-600'}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    );
  }
  