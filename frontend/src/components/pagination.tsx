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
  const [pageSize, setPageSize] = useState(pageSizeOptions[0]);

  const totalPages = Math.ceil(data.length / pageSize);

  const paginatedData = data.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const siblings = 1; // how many pages to show on each side of current
    const showEndCount = 2;

    const left = Math.max(currentPage - siblings, 1);
    const right = Math.min(currentPage + siblings, totalPages);

    // Always show first page
    if (1 !== left) {
      pages.push(1);
      if (left > 2) pages.push('...');
    }

    // Middle pages
    for (let i = left; i <= right; i++) {
      pages.push(i);
    }

    // Always show last few pages
    if (right < totalPages - showEndCount) {
      pages.push('...');
      pages.push(totalPages - 1);
      pages.push(totalPages);
    } else {
      for (let i = right + 1; i <= totalPages; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  return (
    <div className="admin-page-container">
      {children(paginatedData)}

      <div className="pagination-container">
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="pagination-button first"
          >
            ← Prev
          </button>

          {getPageNumbers().map((item, index) =>
            item === '...' ? (
              <span key={`ellipsis-${index}`} className="pagination-ellipsis">
                ...
              </span>
            ) : (
              <button
                key={item}
                onClick={() => setCurrentPage(Number(item))}
                disabled={currentPage === item}
                className={`pagination-button ${currentPage === item ? 'active' : ''}`}
              >
                {item}
              </button>
            ),
          )}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="pagination-button last"
          >
            Next →
          </button>
        </div>

        <div className="pagination-options">
          Results per page:
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="ml-2"
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
