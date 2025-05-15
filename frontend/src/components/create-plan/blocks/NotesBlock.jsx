import React from "react";

const NotesBlock = ({ data, onChange }) => (
  <div className="bg-gray-100 rounded-lg p-4">
    <label className="block text-lg font-semibold mb-2">โน้ต</label>
    <textarea
      className="w-full bg-white rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring"
      value={data.text || ""}
      onChange={e => onChange({ ...data, text: e.target.value })}
      placeholder="พิมพ์ข้อความที่นี่..."
      rows={3}
    />
  </div>
);

export default NotesBlock; 