import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

import { SalesVolumeReport as SalesVolumeReportDomain } from '../../../data/report/domain';
import { ReportMapper } from '../../../data/report/mapper';
import { ReportService } from '../../../data/report/service';

import { ReportFilterProps } from '../SaleReport';
import { SaleVolumeReportItemMemo } from './SalesVolumeReportItem';

interface SalesVolumeReportProps {
  reportFilters?: ReportFilterProps;
}

const SalesVolumeReport: React.FC<SalesVolumeReportProps> = (props: SalesVolumeReportProps) => {
  const {
    reportFilters
  } = props;

  const navigate = useNavigate();

  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [salesVolumeReports, setSalesVolumeReports] = useState<SalesVolumeReportDomain[]>([]);

  const fetchSalesVolumes = async () => {
    try {
      setIsFetching(true);

      const { data } = await ReportService.getSalesVolumeReports({
        start_date: moment(reportFilters?.start_date).subtract(1, 'd').format('Y-MM-DD'),
        end_date: moment(reportFilters?.end_date).add(1, 'd').format('Y-MM-DD')
      });
      if (!data) {
        setIsFetching(false);
        navigate('*', { replace: true });

        return;
      }

      setSalesVolumeReports(ReportMapper.mapGetSalesVolumeReportsResToDomain(data));
    } catch (error) {
      setIsFetching(false);
      navigate('*', { replace: true });
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchSalesVolumes();
  }, [reportFilters?.start_date, reportFilters?.end_date]);

  return (
    <div className="flex flex-col gap-y-8 lg:grid grid-cols-2 gap-x-15 mt-10">
      <SaleVolumeReportItemMemo
        data={salesVolumeReports[0]}
        containerClassName={'w-full lg:ml-auto'}
        isFetching={isFetching}
      />
      <SaleVolumeReportItemMemo
        data={salesVolumeReports[1]}
        containerClassName={'w-full lg:mr-auto'}
        isFetching={isFetching}
      />
    </div>
  );
};

export const SalesVolumeReportMemo = React.memo(SalesVolumeReport);

export default SalesVolumeReport;
