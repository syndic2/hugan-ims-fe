import { TableHeaderLabelProps } from "../../components/Table/Table";

export const TableHeaderLabels: TableHeaderLabelProps[] = [
  {
    label: 'Nama Barang',
    classNames: 'font-semibold text-left w-[25%]'
  },
  {
    label: 'Qty Hugan',
    classNames: 'font-semibold text-right'
  },
  {
    label: 'Qty KRO',
    classNames: 'font-semibold text-right'
  },
  {
    label: 'Status',
    classNames: 'font-semibold text-center'
  },
  {
    label: 'Aksi',
    classNames: 'font-semibold text-center'
  }
];

export const ProductTransactionTableHeaderLabels: TableHeaderLabelProps[] = [
  {
    label: 'No. Nota',
    classNames: 'font-semibold text-left w-[25%]'
  },
  {
    label: 'Tanggal',
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
    label: 'Aksi',
    classNames: 'font-semibold text-center'
  }
];

export const StatusProductOptions = [
  {
    label: 'Aktif',
    value: true
  },
  {
    label: 'Tidak Aktif',
    value: false
  }
];
