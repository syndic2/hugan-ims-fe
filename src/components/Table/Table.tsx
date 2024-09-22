import React from "react";

import { TablePaginationMemo } from './TablePagination';

export interface TableHeaderLabelProps {
  label: string;
  classNames?: string;
}

interface TableProps {
  name: string;
  hasFooter?: boolean;
  hasPagination?: boolean;
  headerLabels?: TableHeaderLabelProps[];
  rowData: any[];
  currentPage?: number;
  totalPage?: number;
  showPageCount?: number;
  rowElementExtraProps?: any;
  RowElement: React.ComponentType<{ index: number, data: any } | any>;
  FooterElement?: React.ReactNode;
  handlePrevPageClick?: () => void;
  handleNextPageClick?: () => void;
  handleSelectedPageClick?: (page: number) => void;
}

const Table: React.FC<TableProps> = (props: TableProps) => {
  const {
    name,
    hasFooter = false,
    hasPagination = true,
    headerLabels,
    rowData,
    currentPage = 0,
    totalPage = 0,
    showPageCount = 3,
    rowElementExtraProps,
    RowElement,
    FooterElement,
    handlePrevPageClick,
    handleNextPageClick,
    handleSelectedPageClick
  } = props;

  return (
    <div className="flex flex-col items-center gap-y-7 w-full h-full">
      <div className="w-full overflow-auto">
        <table className="table-auto w-full">
          {headerLabels ? (
            <thead>
              <tr>
                {headerLabels.map((item, idx) => (
                  <th
                    key={`${name}-table-head-item-${idx}`}
                    className={`sticky top-0 text-nowrap font-medium border-b-2 border-bodydark1 dark:border-strokedark bg-white pb-2 ${item.classNames && item.classNames}`}>
                    {item.label}
                  </th>
                ))}
              </tr>
            </thead>
          ) : null}
          <tbody>
            {rowData.map((item, idx) => (
              <RowElement
                key={`${name}-table-row-item-${idx}`}
                index={idx}
                data={item}
                {...rowElementExtraProps}
              />
            ))}
          </tbody>
          {hasFooter && FooterElement ? (
            <tfoot className="sticky bottom-0">{FooterElement}</tfoot>
          ) : null}
        </table>
      </div>
      {hasPagination && totalPage && totalPage > 0 ? (
        <TablePaginationMemo
          name={name}
          currentPage={currentPage}
          totalPage={totalPage}
          showPageCount={showPageCount}
          handlePrevPageClick={handlePrevPageClick}
          handleNextPageClick={handleNextPageClick}
          handleSelectedPageClick={handleSelectedPageClick}
        />
      ) : null}
    </div>
  );
};

export const TableMemo = React.memo(Table);

export default Table;
