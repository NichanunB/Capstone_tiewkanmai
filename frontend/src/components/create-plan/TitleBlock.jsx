import React from "react";

const TitleBlock = ({ title, onChange }) => (
  <div className="my-4">
    <input
      className="text-2xl font-bold bg-white rounded-lg shadow px-4 py-2 w-full focus:outline-none"
      value={title}
      onChange={e => onChange(e.target.value)}
      placeholder="ชื่อแผนการเดินทาง"
      aria-label="ชื่อแผนการเดินทาง"
    />
  </div>
);

export default TitleBlock; 