import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

import { SupplierReportTableHeaderLabels } from '../../../data/report/constants';
import { SupplierReport as SupplierReportDomain } from '../../../data/report/domain';
import { ReportMapper } from '../../../data/report/mapper';
import { ReportService } from '../../../data/report/service';

import { CardMemo } from '../../../components/Card/Card';
import { DividerMemo } from '../../../components/Divider/Divider';
import { TableMemo } from '../../../components/Table/Table';
import Spinner from '../../../components/Spinner/Spinner';

import { ReportFilterProps } from '../PurchaseReport';
import SupplierReportTableRow from './SupplierReportTableRow';

interface SupplierReportFilterProps extends ReportFilterProps {
  page: number;
  limit: number;
}

interface SupplierReportProps {
  reportFilters?: ReportFilterProps;
  containerClassName?: string;
}

const SupplierReport: React.FC<SupplierReportProps> = (props: SupplierReportProps) => {
  const {
    reportFilters,
    containerClassName
  } = props;

  const navigate = useNavigate();

  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [supplierReportFilters, setSupplierReportFilters] = useState<SupplierReportFilterProps>({
    ...reportFilters,
    page: 1,
    limit: 100
  });
  const [supplierReports, setSupplierReports] = useState<SupplierReportDomain[]>([]);
  const [totalPage, setTotalPage] = useState<number>(0);

  const fetchReportSuppliers = async () => {
    try {
      setIsFetching(true);

      const { data } = await ReportService.getSupplierReports({
        limit: supplierReportFilters.limit,
        page: supplierReportFilters.page,
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

      setSupplierReports((data.result || []).map(item => ReportMapper.mapGetSupplierReportsItemResToDomain(item)));
      setTotalPage(data.total_page || 0);
    } catch (error) {
      setIsFetching(false);
      navigate('*', { replace: true });
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    setSupplierReportFilters(prevState => ({
      ...prevState,
      ...reportFilters
    }));
  }, [reportFilters?.warehouse_select, reportFilters?.start_date, reportFilters?.end_date]);

  useEffect(() => {
    fetchReportSuppliers();
  }, [supplierReportFilters]);

  const onPrevPageClick = useCallback(() => {
    setSupplierReportFilters(prevState => ({
      ...prevState,
      page: prevState.page - 1
    }));
  }, []);

  const onNextPageClick = useCallback(() => {
    setSupplierReportFilters(prevState => ({
      ...prevState,
      page: prevState.page + 1
    }));
  }, []);

  const onSelectedPageClick = useCallback((page: number) => {
    setSupplierReportFilters(prevState => ({
      ...prevState,
      page
    }));
  }, []);

  return (
    <CardMemo containerClassNames={`relative w-full h-fit ${containerClassName ? containerClassName : ''}`}>
      <div className="flex flex-col gap-y-5 px-7.5 py-6">
        <span className="font-semibold text-title-xsm">Pembelian Supplier</span>
        <DividerMemo
          direction={'HORIZONTAL'}
          classNames={'border-stroke'}
        />
        <TableMemo
          name={'supplier-report-table'}
          headerLabels={SupplierReportTableHeaderLabels}
          rowData={supplierReports}
          currentPage={supplierReportFilters.page}
          totalPage={totalPage}
          showPageCount={2}
          RowElement={SupplierReportTableRow}
          handlePrevPageClick={onPrevPageClick}
          handleNextPageClick={onNextPageClick}
          handleSelectedPageClick={onSelectedPageClick}
        />
      </div>
      {isFetching ? (
        <Spinner />
      ) : null}
    </CardMemo>
  );
};

export const SupplierReportMemo = React.memo(SupplierReport);

export default SupplierReport;
