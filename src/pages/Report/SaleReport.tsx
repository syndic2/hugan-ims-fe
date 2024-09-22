import { useState, useMemo, useCallback } from 'react';
import Select, { SingleValue } from 'react-select';
import moment from 'moment';

import { BaseSelect } from '../../commons/common';

import { TRANSACTION_TYPE, TransactionWarehouseSelect } from '../../data/transaction/constants';

import { CardMemo } from '../../components/Card/Card';
import { InputLabelMemo } from '../../components/InputLabel/InputLabel';
import { ButtonMemo } from '../../components/Button/Button';
import { DatePickerMemo } from '../../components/DatePicker/DatePicker';

import { SalesVolumeReportMemo } from './components/SalesVolumeReport';
import { ProductReportMemo } from './components/ProductReport';
// import { CustomerReportMemo } from './components/CustomerReport';

export interface ReportFilterProps {
  warehouse_select?: SingleValue<BaseSelect<string>>;
  transaction_type?: string;
  start_date?: string;
  end_date?: string;
}

const SalesReport: React.FC = () => {
  const [reportFilters, setReportFilters] = useState<ReportFilterProps>({
    warehouse_select: TransactionWarehouseSelect[0],
    transaction_type: TRANSACTION_TYPE.SALE,
    start_date: moment().startOf('month').format('Y-MM-DD'),
    end_date: moment().endOf('month').format('Y-MM-DD')
  });

  const onChangeTransactionWarehouseSelect = useCallback((item?: SingleValue<BaseSelect<string>>) => {
    setReportFilters(prevState => ({
      ...prevState,
      warehouse_select: item
    }));
  }, []);

  const onChangeReportDates = useCallback((name: string, dates: Date[]) => {
    setReportFilters(prevState => ({
      ...prevState,
      [name]: moment(dates[0]).format('Y-MM-DD')
    }));
  }, []);

  const onClickFullCurrentMonth = useCallback(() => {
    setReportFilters(prevState => ({
      ...prevState,
      start_date: moment().startOf('month').format('Y-MM-DD'),
      end_date: moment().endOf('month').format('Y-MM-DD')
    }));
  }, []);

  const reportPeriod = useMemo(() => {
    return `${moment(reportFilters.start_date).format('DD/MMM/Y')} - ${moment(reportFilters.end_date).format('DD/MMM/Y')}`;
  }, [reportFilters.start_date, reportFilters.end_date]);

  return (
    <>
      <CardMemo containerClassNames={'text-center p-5'}>
        <div className="text-xl font-semibold">Laporan Penjualan</div>
        <div className="text-lg font-semibold">({reportPeriod})</div>
      </CardMemo>
      <CardMemo containerClassNames={'w-full lg:w-fit mx-auto mt-7 px-7.5 py-6.5'}>
        <div className="flex flex-col md:flex-row justify-center gap-8">
          <div className="flex flex-col items-center w-full lg:w-fit">
            <InputLabelMemo
              label={'Gudang'}
            />
            <Select
              name={'Sales-report-warehouse-select'}
              className={'flex-1 min-w-full lg:w-50'}
              styles={{
                control: base => ({
                  ...base,
                  width: '100%',
                  height: '100%'
                })
              }}
              options={TransactionWarehouseSelect}
              placeholder={'Pilih gudang'}
              value={reportFilters.warehouse_select}
              onChange={onChangeTransactionWarehouseSelect}
            />
          </div>
          <div className="flex flex-col items-center w-full lg:w-fit">
            <InputLabelMemo
              label={'Tanggal Awal'}
            />
            <DatePickerMemo
              name={'start_date'}
              mode={'single'}
              className={'w-full'}
              defaultDate={moment(reportFilters.start_date).toDate()}
              handleChange={onChangeReportDates}
            />
          </div>
          <div className="flex flex-col items-center w-full lg:w-fit">
            <InputLabelMemo
              label={'Tanggal Akhir'}
            />
            <DatePickerMemo
              name={'end_date'}
              mode={'single'}
              className={'w-full'}
              defaultDate={moment(reportFilters.end_date).toDate()}
              handleChange={onChangeReportDates}
            />
          </div>
        </div>
        <ButtonMemo
          label={'Laporan Dalam 1 Bulan'}
          classNames={'self-end w-full md:w-60 h-fit mx-auto mt-5'}
          handleClick={onClickFullCurrentMonth}
        />
      </CardMemo>
      <SalesVolumeReportMemo
        reportFilters={reportFilters}
      />
      {/* <div className="flex flex-col gap-y-8 lg:grid grid-cols-2 gap-x-15 mt-10">
        <ProductReportMemo
          reportFilters={reportFilters}
          containerClassName={'ml-auto'}
        />
        <CustomerReportMemo
          reportFilters={reportFilters}
          containerClassName={'mr-auto'}
        />
      </div> */}
      <div className="mt-10">
        <ProductReportMemo
          reportFilters={reportFilters}
          containerClassName={'ml-auto'}
        />
      </div>
    </>
  );
};

export default SalesReport;
