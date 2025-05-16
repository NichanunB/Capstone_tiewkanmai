// src/components/Pagination.jsx
import React from 'react';

export default function Pagination({ currentPage = 1, totalPages = 1, onChange }) {
  if (totalPages <= 1) return null; // ไม่แสดงถ้ามีเพียงหน้าเดียว

  // สร้างรายการหมายเลขหน้าที่จะแสดง
  const getPageNumbers = () => {
    if (totalPages <= 5) {
      // แสดงทุกหน้าถ้ามีไม่เกิน 5 หน้า
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    } else if (currentPage <= 3) {
      // ถ้าอยู่ในหน้าแรกๆ
      return [1, 2, 3, 4, 5];
    } else if (currentPage >= totalPages - 2) {
      // ถ้าอยู่ในหน้าท้ายๆ
      return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    } else {
      // หน้าตรงกลาง
      return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
    }
  };

  const handlePageClick = (page) => {
    if (page === currentPage) return;
    if (page < 1 || page > totalPages) return;
    onChange(page);
  };

  const pages = getPageNumbers();

  return (
    <div className="flex justify-center my-6">
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1}
          className={`text-gray-500 cursor-pointer ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {'< กลับ'}
        </button>
        
        {currentPage > 3 && totalPages > 5 && (
          <>
            <button
              onClick={() => handlePageClick(1)}
              className="px-3 py-1 rounded cursor-pointer text-gray-700"
            >
              1
            </button>
            <span className="text-gray-500">...</span>
          </>
        )}
        
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => handlePageClick(page)}
            className={`px-3 py-1 rounded cursor-pointer ${currentPage === page ? 'bg-[#3674B5] text-white' : 'text-gray-700'}`}
          >
            {page}
          </button>
        ))}
        
        {currentPage < totalPages - 2 && totalPages > 5 && (
          <>
            <span className="text-gray-500">...</span>
            <button
              onClick={() => handlePageClick(totalPages)}
              className="px-3 py-1 text-gray-700 cursor-pointer"
            >
              {totalPages}
            </button>
          </>
        )}
        
        <button
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`text-gray-500 cursor-pointer ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {'ถัดไป >'}
        </button>
      </div>
    </div>
  );
}