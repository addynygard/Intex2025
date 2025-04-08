import React, { useState } from 'react';
interface PaginationProps<T> {
    data: T[];
    pageSizeOptions?: number[];
    children: (paginatedData: T[]) => React.ReactNode;
  }
  const Pagination = <T,>({
    data,
    pageSizeOptions = [25, 50, 100],
    children,
  }: PaginationProps<T>) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(pageSizeOptions[1]);
    const totalPages = Math.ceil(data.length / pageSize);
    const paginatedData = data.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    );
    return (
      <div className="p-4">
        {children(paginatedData)}
        {/* Pagination Controls (same styling as before) */}
        <div className="flex flex-wrap items-center justify-between mt-4">
          <div className="flex items-center space-x-1 flex-wrap">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="px-3 py-1 rounded border border-gray-600 text-gray-100 bg-gray-800 hover:bg-gray-700 disabled:opacity-50"
            >
              ← Previous
            </button>
            {/* Smart Page Buttons */}
            {(() => {
              const pageButtons = [];
              const maxVisible = 4;
              const finalPage = totalPages;
              for (
                let i = currentPage;
                i < currentPage + maxVisible && i <= finalPage;
                i++
              ) {
                pageButtons.push(
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    disabled={currentPage === i}
                    className={`px-3 py-1 rounded border ${
                      currentPage === i
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'bg-gray-900 text-gray-200 hover:bg-purple-700 border-gray-700'
                    }`}
                  >
                    {i}
                  </button>
                );
              }
              if (currentPage + maxVisible < finalPage) {
                pageButtons.push(
                  <span key="dots" className="px-2 text-gray-500">...</span>
                );
                pageButtons.push(
                  <button
                    key={finalPage}
                    onClick={() => setCurrentPage(finalPage)}
                    className={`px-3 py-1 rounded border ${
                      currentPage === finalPage
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'bg-gray-900 text-gray-200 hover:bg-purple-700 border-gray-700'
                    }`}
                  >
                    {finalPage}
                  </button>
                );
              }
              return pageButtons;
            })()}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="px-3 py-1 rounded border border-gray-600 text-gray-100 bg-gray-800 hover:bg-gray-700 disabled:opacity-50"
            >
              Next →
            </button>
          </div>
          <div className="text-sm mt-2 text-gray-300">
            Results per page:{' '}
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="ml-2 p-1 border rounded bg-gray-900 text-white border-gray-600"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    );
  };
  export default Pagination;