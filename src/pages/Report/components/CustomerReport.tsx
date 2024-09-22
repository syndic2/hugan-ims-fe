import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

import { CustomerReportTableHeaderLabels } from '../../../data/report/constants';
import { CustomerReport as CustomerReportDomain } from '../../../data/report/domain';
import { ReportMapper } from '../../../data/report/mapper';
import { ReportService } from '../../../data/report/service';

import { CardMemo } from '../../../components/Card/Card';
import { DividerMemo } from '../../../components/Divider/Divider';
import { TableMemo } from '../../../components/Table/Table';
import Spinner from '../../../components/Spinner/Spinner';

import { ReportFilterProps } from '../PurchaseReport';
import CustomerReportTableRow from './CustomerReportTableRow';

interface CustomerReportFilterProps extends ReportFilterProps {
  page: number;
  limit: number;
}

interface CustomerReportProps {
  reportFilters?: ReportFilterProps;
  containerClassName?: string;
}

const CustomerReport: React.FC<CustomerReportProps> = (props: CustomerReportProps) => {
  const {
    reportFilters,
    containerClassName
  } = props;

  const navigate = useNavigate();

  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [customerReportFilters, setCustomerReportFilters] = useState<CustomerReportFilterProps>({
    ...reportFilters,
    page: 1,
    limit: 100
  });
  const [customerReports, setCustomerReports] = useState<CustomerReportDomain[]>([]);
  const [totalPage, setTotalPage] = useState<number>(0);

  const fetchCustomerReports = async () => {
    try {
      setIsFetching(true);

      const { data } = await ReportService.getCustomerReports({
        limit: customerReportFilters.limit,
        page: customerReportFilters.page,
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

      setCustomerReports((data.result || []).map(item => ReportMapper.mapGetCustomerReportsItemResToDomain(item)));
      setTotalPage(data.total_page || 0);
    } catch (error) {
      setIsFetching(false);
      navigate('*', { replace: true });
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    setCustomerReportFilters(prevState => ({
      ...prevState,
      ...reportFilters
    }));
  }, [reportFilters?.warehouse_select, reportFilters?.start_date, reportFilters?.end_date]);

  useEffect(() => {
    fetchCustomerReports();
  }, [customerReportFilters]);

  const onPrevPageClick = useCallback(() => {
    setCustomerReportFilters(prevState => ({
      ...prevState,
      page: prevState.page - 1
    }));
  }, []);

  const onNextPageClick = useCallback(() => {
    setCustomerReportFilters(prevState => ({
      ...prevState,
      page: prevState.page + 1
    }));
  }, []);

  const onSelectedPageClick = useCallback((page: number) => {
    setCustomerReportFilters(prevState => ({
      ...prevState,
      page
    }));
  }, []);

  return (
    <CardMemo containerClassNames={`relative w-full h-fit ${containerClassName ? containerClassName : ''}`}>
      <div className="flex flex-col gap-y-5 px-7.5 py-6">
        <span className="font-semibold text-title-xsm">Penjualan Customer</span>
        <DividerMemo
          direction={'HORIZONTAL'}
          classNames={'border-stroke'}
        />
        <TableMemo
          name={'customer-report-table'}
          headerLabels={CustomerReportTableHeaderLabels}
          rowData={customerReports}
          currentPage={customerReportFilters.page}
          totalPage={totalPage}
          showPageCount={2}
          RowElement={CustomerReportTableRow}
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

export const CustomerReportMemo = React.memo(CustomerReport);

export default CustomerReport;
