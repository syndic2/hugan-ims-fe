import React, { useMemo } from 'react';
import { FaChevronLeft } from 'react-icons/fa6';
import { FaChevronRight } from 'react-icons/fa6';

interface TablePaginationProps {
  name: string;
  classNames?: string;
  currentPage: number;
  totalPage: number;
  showPageCount: number;
  handlePrevPageClick?: () => void;
  handleNextPageClick?: () => void;
  handleSelectedPageClick?: (page: number) => void;
}

const TablePagination: React.FC<TablePaginationProps> = (
  props: TablePaginationProps,
) => {
  const {
    name,
    classNames,
    currentPage,
    totalPage,
    showPageCount,
    handlePrevPageClick,
    handleNextPageClick,
    handleSelectedPageClick,
  } = props;

  const createPages = useMemo(() => {
    let pages: number[] = [];

    if (totalPage < showPageCount) {
      for (let i = 1; i <= totalPage; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage % showPageCount === 0) {
        for (let i = currentPage; i <= totalPage; i++) {
          pages.push(i);
        }
      } else {
        if (currentPage === totalPage) {
          for (let i = currentPage - 1; i <= totalPage; i++) {
            pages.push(i);
          }
        } else {
          for (let i = 1; i <= totalPage; i++) {
            pages.push(i);
          }
        }
      }
    }

    return pages.slice(0, showPageCount);
  }, [currentPage, totalPage]);

  const onSelectedPageClick = (page: number) => {
    handleSelectedPageClick && handleSelectedPageClick(page);
  };

  return (
    <nav className={`${classNames && classNames}`}>
      <ul className="flex flex-wrap items-center gap-x-2">
        {currentPage > 1 ? (
          <li onClick={handlePrevPageClick} className="cursor-pointer">
            <div className="flex items-center justify-center rounded hover:bg-primary hover:text-white px-2 py-1.5">
              <FaChevronLeft size={20} />
            </div>
          </li>
        ) : null}
        {createPages.map((pageNumber, idx) => (
          <li
            key={`${name}-table-pagination-item-${idx}`}
            onClick={() => onSelectedPageClick(pageNumber)}
            className="cursor-pointer"
          >
            <span
              className={`${
                currentPage === pageNumber ? 'bg-primary text-white' : ''
              } flex items-center justify-center rounded px-3 py-1.5 font-medium hover:bg-primary hover:text-white`}
            >
              {pageNumber}
            </span>
          </li>
        ))}
        {currentPage !== totalPage ? (
          <li onClick={handleNextPageClick} className="cursor-pointer">
            <div className="flex items-center justify-center rounded hover:bg-primary hover:text-white px-2 py-1.5">
              <FaChevronRight size={20} />
            </div>
          </li>
        ) : null}
      </ul>
    </nav>
  );
};

export const TablePaginationMemo = React.memo(TablePagination);

export default TablePagination;
