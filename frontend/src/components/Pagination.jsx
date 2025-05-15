import { useState } from 'react';

export default function Pagination() {
  const [currentPage, setCurrentPage] = useState(1);

  // Show different page numbers based on current page
  const getPageNumbers = () => {
    if (currentPage <= 3) {
      return [1, 2, 3, 4, 5];
    } else {
      return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
    }
  };

  return (
    <div className="flex justify-center my-6">
      <div className="flex items-center space-x-2">
        <a
          href="#"
          className="text-gray-500 cursor-pointer"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        >
          {'< กลับ'}
        </a>
        {getPageNumbers().map((page) => (
          <a
            key={page}
            href="#"
            className={`px-3 py-1 rounded cursor-pointer ${currentPage === page ? 'bg-[#3674B5] text-white' : 'text-gray-700'}`}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </a>
        ))}
        <span className="text-gray-500">...</span>
        <a href="#" className="px-3 py-1 text-gray-700 cursor-pointer">141</a>
        <a
          href="#"
          className="text-gray-500 cursor-pointer"
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          {'ถัดไป >'}
        </a>
      </div>
    </div>
  );
}
