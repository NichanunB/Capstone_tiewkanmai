import React, { useState, useEffect } from "react";

const ListBlock = ({ data, onChange }) => {
  const [input, setInput] = useState("");

  // Initialize items array if it doesn't exist
  useEffect(() => {
    console.log("Initial data:", data);
    if (!data.items) {
      console.log("Initializing items array");
      onChange({ ...data, items: [] });
    }
  }, []);

  const addItem = () => {
    console.log("Adding item:", input);
    console.log("Current data:", data);
    if (input.trim()) {
      const newData = { ...data, items: [...(data.items || []), input.trim()] };
      console.log("New data to be set:", newData);
      onChange(newData);
      setInput("");
    }
  };

  const removeItem = idx => {
    const newItems = [...(data.items || [])];
    newItems.splice(idx, 1);
    onChange({ ...data, items: newItems });
  };

  console.log("Current render data:", data);

  return (
    <div className="bg-gray-100 rounded-lg p-4">
      <label className="block text-lg font-semibold mb-2">รายการ</label>
      <div className="flex mb-2">
        <input
          className="flex-1 bg-white rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="พิมพ์ข้อความที่นี่..."
        />
        <button
          className="ml-2 px-3 py-1 text-white rounded-lg bg-[#3674b5] hover:bg-[#2a5b8e]"
          onClick={addItem}
          type="button"
        >
          +
        </button>
      </div>
      <ul className="list-disc pl-5">
        {(data.items || []).map((item, idx) => (
          <li key={idx} className="flex items-center justify-between">
            <span>{item}</span>
            <button
              className="ml-2 text-red-500 hover:text-red-700"
              onClick={() => removeItem(idx)}
              type="button"
            >
              &times;
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListBlock; 