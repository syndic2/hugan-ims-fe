import React from 'react';

import { numericFormat, rupiahFormat } from '../../../commons/helpers';
import { SalesVolumeReport } from '../../../data/report/domain';

import { CardMemo } from '../../../components/Card/Card';
import { DividerMemo } from '../../../components/Divider/Divider';
import Spinner from '../../../components/Spinner/Spinner';

interface SalesVolumeReportItemProps {
  data?: SalesVolumeReport;
  containerClassName?: string;
  isFetching: boolean;
}

const SalesVolumeReportItem = (props: SalesVolumeReportItemProps) => {
  const {
    data,
    containerClassName,
    isFetching
  } = props;

  return (
    <CardMemo containerClassNames={`relative w-fit ${containerClassName ? containerClassName : ''}`}>
      <div className={'py-6 px-7.5'}>
        <div className="text-xl font-semibold text-center">{data?.warehouseId || '-'}</div>
        <DividerMemo
          direction={'HORIZONTAL'}
          classNames={'border-stroke my-4'}
        />
        <div className="grid grid-cols-[1fr_min-content_1fr] gap-8">
          <div className="flex flex-col gap-y-6">
            <div className="flex flex-col items-center gap-y-2">
              <span className="text-lg font-semibold">Jumlah Pembelian</span>
              <span className="text-lg">{numericFormat(data?.countPurchase || 0)}</span>
            </div>
            <div className="flex flex-col items-center gap-y-2">
              <span className="text-lg font-semibold">Total Pembelian</span>
              <span className="text-lg">{rupiahFormat(data?.grandTotalPurchase || 0)}</span>
            </div>
          </div>
          <DividerMemo
            direction={'VERTICAL'}
            classNames={'border-stroke'}
          />
          <div className="flex flex-col gap-y-6">
            <div className="flex flex-col items-center gap-y-2">
              <span className="text-lg font-semibold">Jumlah Penjualan</span>
              <span className="text-lg">{numericFormat(data?.countSale || 0)}</span>
            </div>
            <div className="flex flex-col items-center gap-y-2">
              <span className="text-lg font-semibold">Total Penjualan</span>
              <span className="text-lg">{rupiahFormat(data?.grandTotalSale || 0)}</span>
            </div>
          </div>
        </div>
      </div>
      {isFetching ? (
        <Spinner />
      ) : null}
    </CardMemo>
  );
};

export const SaleVolumeReportItemMemo = React.memo(SalesVolumeReportItem);

export default SalesVolumeReportItem;
