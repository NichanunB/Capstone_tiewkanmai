import React from "react";

const CoverImageBlock = ({ imageUrl, onChange }) => (
  <div className="relative w-full h-48 my-4">
    {imageUrl ? (
      <img
        src={imageUrl}
        alt="รูปปก"
        className="object-cover w-full h-full rounded-lg shadow"
      />
    ) : (
      <div className="flex items-center justify-center w-full h-full bg-gray-200 rounded-lg shadow">
        <span className="text-gray-500">ไม่มีรูปปก</span>
      </div>
    )}
    <input
      type="file"
      accept="image/*"
      className="absolute top-2 right-2 opacity-0 w-8 h-8 cursor-pointer"
      onChange={e => {
        if (e.target.files && e.target.files[0]) {
          const reader = new FileReader();
          reader.onload = ev => onChange(ev.target.result);
          reader.readAsDataURL(e.target.files[0]);
        }
      }}
      aria-label="เปลี่ยนรูปปก"
    />
    <button
      className="absolute top-2 right-2 bg-white bg-opacity-80 rounded-full p-1 shadow hover:bg-opacity-100 transition"
      onClick={() => document.querySelector('input[type=file]').click()}
      type="button"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-700">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
      </svg>
    </button>
  </div>
);

export default CoverImageBlock; 