import { BaseSelect } from '../../commons/common';
import { TableHeaderLabelProps } from '../../components/Table/Table';

export enum TRANSACTION_TYPE {
  PURCHASE = 'PURCHASE',
  SALE = 'SALES',
  SPLIT = 'SPLIT',
  COMBINE = 'COMBINE',
  DELIVERY_NOTE = 'DELIVERY_NOTE'
}

export enum WAREHOUSE_CODE {
  KRO = 'KRO',
  HUGAN = 'HUGAN'
}

export const TransactionTypeSelect: BaseSelect<string>[] = [
  {
    label: 'Pembelian',
    value: TRANSACTION_TYPE.PURCHASE
  },
  {
    label: 'Penjualan',
    value: TRANSACTION_TYPE.SALE
  }
];

export const TransactionWarehouseSelect: BaseSelect<string>[] = [
  {
    label: 'Hugan',
    value: WAREHOUSE_CODE.HUGAN
  },
  {
    label: 'KRO',
    value: WAREHOUSE_CODE.KRO
  }
];

export const TransactionTableHeaderLabels: TableHeaderLabelProps[] = [
  {
    label: 'No. Nota',
    classNames: 'font-semibold text-left'
  },
  {
    label: 'Tanggal Transaksi',
    classNames: 'font-semibold text-left'
  },
  {
    label: 'Tipe Transaksi',
    classNames: 'font-semibold text-left'
  },
  {
    label: 'Gudang',
    classNames: 'font-semibold text-left'
  },
  {
    label: 'Supplier',
    classNames: 'font-semibold text-left'
  },
  {
    label: 'Customer',
    classNames: 'font-semibold text-left'
  },
  {
    label: 'Total Barang',
    classNames: 'font-semibold text-right'
  },
  {
    label: `Total`,
    classNames: 'font-semibold text-right'
  },
  {
    label: `Aksi`,
    classNames: 'font-semibold text-center'
  }
];

export const CombinedDtransactionTableHeaderLabels: TableHeaderLabelProps[] = [
  {
    label: 'Nama Barang',
    classNames: 'font-semibold text-left'
  },
  {
    label: 'Quantity',
    classNames: 'font-semibold text-right'
  }
];

export const DtransactionTableHeaderLabels = (transactionType: string): TableHeaderLabelProps[] => [
  {
    label: 'Nama Barang',
    classNames: 'font-semibold text-left'
  },
  {
    label: 'Quantity',
    classNames: 'font-semibold text-right'
  },
  {
    label: 'Harga',
    classNames: 'font-semibold text-right'
  },
  {
    label: 'Subtotal (Tanpa Diskon)',
    classNames: 'font-semibold text-right'
  },
  {
    label: 'Diskon',
    classNames: 'font-semibold text-right'
  },
  {
    label: 'Subtotal (Akhir)',
    classNames: 'font-semibold text-right'
  },
  ...transactionType === TRANSACTION_TYPE.SALE ? [
    {
      label: 'Aksi',
      classNames: 'font-semibold text-center'
    }
  ] : []
];
