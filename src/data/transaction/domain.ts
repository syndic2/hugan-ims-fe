import { BaseSelect } from '../../commons/common';

import { Customer } from "../customer/domain";
import { Supplier } from "../supplier/domain";
import { DTransaction } from "../dtransaction/domain";

import { WAREHOUSE_CODE, TRANSACTION_TYPE } from "./constants";

export interface TransactionProps {
  transaction_id?: string;
  transaction_select?: BaseSelect<string> | null;

  transaction_type?: TRANSACTION_TYPE | string;

  nota_id?: string;

  warehouse_id?: WAREHOUSE_CODE | string;
  warehouse_select?: BaseSelect<string> | null;

  customer?: Customer;
  customer_select?: BaseSelect<number> | null;

  supplier?: Supplier;
  supplier_select?: BaseSelect<number> | null;

  items?: number;
  discount?: number;
  ppn?: number;
  subtotal?: number;
  total?: number;
  total_wo_tax?: number;

  created_at?: string;
  start_date?: string;
  end_date?: string;

  remark?: string;
  dtransactions?: DTransaction[];

  parent_product_select?: BaseSelect<string>;
  quantity_parent_product?: number;
}

export const InitialPurchaseTransaction: TransactionProps = {
  transaction_id: '',
  warehouse_select: null,
  supplier_select: null,
  ppn: 0,
  dtransactions: []
};

export const InitialSaleTransaction: TransactionProps = {
  warehouse_select: null,
  customer_select: null,
  ppn: 0,
  discount: 0,
  dtransactions: []
};

export const InitialDeliveryNoteTransaction: TransactionProps = {
  warehouse_select: null,
  transaction_select: null,
  dtransactions: []
};

export const InitialSplitStockProduct: TransactionProps = {
  quantity_parent_product: 1,
  dtransactions: []
};

export class Transaction {
  public props: TransactionProps;

  protected constructor(props: TransactionProps) {
    this.props = props;
  }

  static create(props: TransactionProps): Transaction {
    return new Transaction(props);
  }

  get transactionId(): string | undefined {
    return this.props.transaction_id;
  }

  get transactionSelect(): BaseSelect<string> | null | undefined {
    return this.props.transaction_select;
  }

  get transactionType(): TRANSACTION_TYPE | string | undefined {
    return this.props.transaction_type;
  }

  get notaId(): string | undefined {
    return this.props.nota_id;
  }

  get warehouseId(): WAREHOUSE_CODE | string | undefined {
    return this.props.warehouse_id;
  }

  get warehouseSelect(): BaseSelect<string> | null | undefined {
    return this.props.warehouse_select;
  }

  get customer(): Customer | undefined {
    return this.props.customer;
  }

  get customerSelect(): BaseSelect<number> | null | undefined {
    return this.props.customer_select;
  }

  get supplier(): Supplier | undefined {
    return this.props.supplier;
  }

  get supplierSelect(): BaseSelect<number> | null | undefined {
    return this.props.supplier_select;
  }

  get items(): number | undefined {
    return this.props.items;
  }

  get discount(): number | undefined {
    return this.props.discount;
  }

  get ppn(): number | undefined {
    return this.props.ppn;
  }

  get subTotal(): number | undefined {
    return this.props.subtotal;
  }

  get total(): number | undefined {
    return this.props.total;
  }

  get totalWoTax(): number | undefined {
    return this.props.total_wo_tax;
  }

  get createdAt(): string | undefined {
    return this.props.created_at;
  }

  get startDate(): string | undefined {
    return this.props.start_date;
  }

  get endDate(): string | undefined {
    return this.props.end_date;
  }

  get remark(): string | undefined {
    return this.props.remark;
  }

  get dtransactions(): DTransaction[] | undefined {
    return this.props.dtransactions;
  }

  get parentProductSelect(): BaseSelect<string> | undefined {
    return this.props.parent_product_select;
  }

  get quantityParentProduct(): number | undefined {
    return this.props.quantity_parent_product;
  }

  getTransactionTypeLabel(): string {
    return this.transactionType === TRANSACTION_TYPE.PURCHASE ? 'Pembelian' : 'Penjualan';
  }
}
