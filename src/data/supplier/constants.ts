import { TableHeaderLabelProps } from "../../components/Table/Table";

export const TableHeaderLabels: TableHeaderLabelProps[] = [
  {
    label: 'Nama Supplier',
    classNames: 'font-semibold text-left'
  },
  {
    label: 'NPWP',
    classNames: 'font-semibold text-right'
  },
  {
    label: 'Alamat',
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

export const SupplierTransactionTableHeaderLabels: TableHeaderLabelProps[] = [
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

export const StatusSupplierOptions = [
  {
    label: 'Aktif',
    value: true
  },
  {
    label: 'Tidak Aktif',
    value: false
  }
];
