import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebouncedCallback } from 'use-debounce';
import moment from 'moment';

import { TRANSACTION_TYPE } from '../../../data/transaction/constants';
import { ProductReportTableHeaderLabels } from '../../../data/report/constants';
import { ProductReport as ProductReportDomain } from '../../../data/report/domain';
import { ReportMapper } from '../../../data/report/mapper';
import { ReportService } from '../../../data/report/service';

import { CardMemo } from '../../../components/Card/Card';
import { DividerMemo } from '../../../components/Divider/Divider';
import { InputMemo } from '../../../components/Input/Input';
import { TableMemo } from '../../../components/Table/Table';
import Spinner from '../../../components/Spinner/Spinner';

import { ReportFilterProps } from '../PurchaseReport'
import ProductReportTableRow, { ProductReportTableRowExtraProps } from './ProductReportTableRow';
import ProductTransactionReportModal from './ProductTransactionReportModal';

interface ProductReportFilterProps extends ReportFilterProps {
  q?: string;
  page: number;
  limit: number;
}

interface ProductReportProps {
  reportFilters?: ReportFilterProps;
  containerClassName?: string;
}

const ProductReport: React.FC<ProductReportProps> = (props: ProductReportProps) => {
  const {
    reportFilters,
    containerClassName
  } = props;

  const navigate = useNavigate();

  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [productReportFilters, setProductReportFilters] = useState<ProductReportFilterProps>({
    ...reportFilters,
    page: 1,
    limit: 100
  });
  const [productReports, setProductReports] = useState<ProductReportDomain[]>([]);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [isOpenProductTransactionReportModal, setIsOpenProductTransactionReportModal] = useState<boolean>(false);
  const [selectedProductReport, setSelectedProductReport] = useState<ProductReportDomain>();

  const fetchProductReports = async () => {
    try {
      setIsFetching(true);

      const { data } = await ReportService.getProductReports({
        q: productReportFilters.q,
        page: productReportFilters.page,
        limit: productReportFilters.limit,
        warehouse_id: reportFilters?.warehouse_select?.value,
        transaction_type: reportFilters?.transaction_type,
        start_date: moment(reportFilters?.start_date).subtract(1, 'd').format('Y-MM-DD'),
        end_date: moment(reportFilters?.end_date).add(1, 'd').format('Y-MM-DD')
      });
      if (!data) {
        setIsFetching(false);
        navigate('*', { replace: true });

        return;
      }

      setProductReports((data.result || []).map(item => ReportMapper.mapGetProductReportsItemResToDomain(item)));
      setTotalPage(data.total_page || 0);
    } catch (error) {
      setIsFetching(false);
      navigate('*', { replace: true });
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    setProductReportFilters(prevState => ({
      ...prevState,
      ...reportFilters
    }));
  }, [reportFilters?.warehouse_select, reportFilters?.start_date, reportFilters?.end_date]);

  useEffect(() => {
    fetchProductReports();
  }, [productReportFilters]);

  const onSearchChange = useDebouncedCallback(useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setProductReportFilters(prevState => ({
      ...prevState,
      q: e.target.value
    }));
  }, []), 500);

  const onPrevPageClick = useCallback(() => {
    setProductReportFilters(prevState => ({
      ...prevState,
      page: prevState.page - 1
    }));
  }, []);

  const onNextPageClick = useCallback(() => {
    setProductReportFilters(prevState => ({
      ...prevState,
      page: prevState.page + 1
    }));
  }, []);

  const onSelectedPageClick = useCallback((page: number) => {
    setProductReportFilters(prevState => ({
      ...prevState,
      page
    }));
  }, []);

  const onOpenProductTransactionReportModal = useCallback((data: ProductReportDomain) => {
    setIsOpenProductTransactionReportModal(true);
    setSelectedProductReport(data);
  }, []);

  const onCloseProductTransactionReportModal = useCallback(() => {
    setIsOpenProductTransactionReportModal(false);
  }, []);

  const ProductTransactionReportTableRowExtraProps = useMemo((): ProductReportTableRowExtraProps => ({
    handleOpenProductTransactionReportModal: onOpenProductTransactionReportModal
  }), [onOpenProductTransactionReportModal]);

  const transactionTypeLabel = useMemo(() => reportFilters?.transaction_type === TRANSACTION_TYPE.PURCHASE ? 'Pembelian' : 'Penjualan', [reportFilters?.transaction_type]);

  return (
    <div className="relative">
      <CardMemo containerClassNames={`w-full h-fit ${containerClassName ? containerClassName : ''} py-6`}>
        <div className="flex flex-col gap-y-5">
          <div className="flex flex-col gap-y-3 md:flex-row md:justify-between md:items-center px-7.5">
            <span className="font-semibold text-title-xsm">Daftar Barang {transactionTypeLabel}</span>
            <InputMemo
              name={'q'}
              type={'text'}
              placeholder={'Cari nama barang...'}
              isSearch
              containerClassNames={'w-full md:w-[400px]'}
              classNames={'w-full'}
              handleChange={onSearchChange}
            />
          </div>
          <DividerMemo
            direction={'HORIZONTAL'}
            classNames={'border-stroke'}
          />
          <TableMemo
            name={'product-report-table'}
            headerLabels={ProductReportTableHeaderLabels}
            currentPage={productReportFilters.page}
            totalPage={totalPage}
            showPageCount={2}
            rowData={productReports}
            rowElementExtraProps={ProductTransactionReportTableRowExtraProps}
            RowElement={ProductReportTableRow}
            handlePrevPageClick={onPrevPageClick}
            handleNextPageClick={onNextPageClick}
            handleSelectedPageClick={onSelectedPageClick}
          />
        </div>
      </CardMemo>
      {isOpenProductTransactionReportModal ? (
        <ProductTransactionReportModal
          isOpen={isOpenProductTransactionReportModal}
          transactionTypeLabel={transactionTypeLabel}
          reportFilters={reportFilters}
          productReport={selectedProductReport}
          handleCloseModal={onCloseProductTransactionReportModal}
        />
      ) : null}
      {isFetching ? (
        <Spinner />
      ) : null}
    </div>
  );
};

export const ProductReportMemo = React.memo(ProductReport);

export default ProductReport;
