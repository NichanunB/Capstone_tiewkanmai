import React, { useState } from "react";

const BudgetBlock = ({ data, onChange }) => {
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");

  const addItem = () => {
    if (label.trim() && amount && !isNaN(amount)) {
      const newItems = [...(data.items || []), { label: label.trim(), amount: parseFloat(amount) }];
      onChange({ ...data, items: newItems });
      setLabel("");
      setAmount("");
    }
  };

  const removeItem = idx => {
    const newItems = [...(data.items || [])];
    newItems.splice(idx, 1);
    onChange({ ...data, items: newItems });
  };

  const updateItem = (idx, key, value) => {
    const newItems = [...(data.items || [])];
    newItems[idx] = { ...newItems[idx], [key]: key === 'amount' ? parseFloat(value) || 0 : value };
    onChange({ ...data, items: newItems });
  };

  const total = (data.items || []).reduce((sum, item) => sum + (item.amount || 0), 0);

  return (
    <div className="bg-gray-100 rounded-lg p-4 flex flex-col items-start w-full">
      <label className="block text-lg font-semibold mb-2">งบประมาณ</label>
      <div className="flex w-full mb-2 gap-2">
        <input
          className="flex-1 bg-white rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring"
          value={label}
          onChange={e => setLabel(e.target.value)}
          placeholder="รายการ"
        />
        <input
          type="number"
          className="w-32 bg-white rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          placeholder="จำนวนเงิน"
          min={0}
        />
        <button
          className="px-3 py-1 bg-[#3674b5] text-white rounded-lg hover:bg-[#2a5b8e]"
          onClick={addItem}
          type="button"
        >
          +
        </button>
      </div>
      <ul className="w-full mb-2">
        {(data.items || []).map((item, idx) => (
          <li key={idx} className="flex items-center gap-2 mb-1">
            <input
              className="flex-1 bg-white rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring"
              value={item.label}
              onChange={e => updateItem(idx, 'label', e.target.value)}
              placeholder="รายการ"
            />
            <input
              type="number"
              className="w-32 bg-white rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring"
              value={item.amount}
              onChange={e => updateItem(idx, 'amount', e.target.value)}
              min={0}
            />
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
      <div className="w-full flex justify-end mt-2">
        <span className="text-xl font-bold">รวม: {total.toLocaleString()} บาท</span>
      </div>
    </div>
  );
};

export default BudgetBlock; 