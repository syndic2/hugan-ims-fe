import { BaseListQueryParam } from "../../commons/common";

export interface GetTransactionsQuery extends BaseListQueryParam {
  start_date?: string;
  end_date?: string;
  transaction_type?: string;
  warehouse_id?: string;
}

export interface GetTransactionsItemRes {
  transaction_id?: string;
  nota_id?: string;
  transaction_type?: string;
  warehouse_id?: string;
  customer_id?: number;
  customer?: GetTransactionCustomerRes;
  supplier_id?: number;
  supplier?: GetTransactionSupplierRes;
  items?: number;
  total?: number;
  created_at?: string;
}

export interface GetTransactionsSelectQuery {
  warehouse_id?: string;
  start_date?: string;
  end_date?: string;
}

export interface GetTransactionParam {
  transaction_id?: string;
}

export interface GetTransactionDtransactionsProductRes {
  product_code?: string;
  product_name?: string;
  quantity?: number;
  price?: number;
  discount?: number;
  ppn?: number;
  total?: number;
}

export interface GetTransactionDtransactionsRes {
  remark?: string;
  is_combined?: boolean;
  quantity?: number;
  price?: number;
  discount?: number;
  subtotal?: number;
  product?: GetTransactionDtransactionsProductRes | GetTransactionDtransactionsProductRes[];
}

export interface GetTransactionCustomerRes {
  id?: number;
  customer_name?: string;
  npwp?: string;
  address?: string;
  is_active?: boolean;
}

export interface GetTransactionSupplierRes {
  id?: number;
  supplier_name?: string;
  npwp?: string;
  address?: string;
  phone_number?: string;
  is_active?: boolean;
}

export interface GetTransactionRes extends GetTransactionsItemRes {
  discount?: number;
  ppn?: number;
  subtotal?: number;
  total_wo_tax?: number;
  dtransactions?: GetTransactionDtransactionsRes[];
}

export interface GetDeliveryNoteTransactionQuery {
  warehouse_id?: string;
}

export interface AddPurchaseTransactionItemsBody {
  product_id?: string;
  quantity?: number;
  price?: number;
  discount?: number;
  ppn?: number;
}

export interface AddPurchaseTransactionBody {
  transaction_id?: string;
  supplier_id?: number;
  warehouse_id?: string;
  items?: AddPurchaseTransactionItemsBody[];
}

export interface AddSaleTransactionItemsBody extends AddPurchaseTransactionItemsBody {
  remark?: string;
}

export interface AddSaleTransactionBody {
  customer_id?: number;
  warehouse_id?: string;
  discount?: number;
  items?: AddSaleTransactionItemsBody[];
}

export interface AddSplitStockProductChildProductBody {
  product_code?: string;
  quantity?: number;
}

export interface AddSplitStockProductBody {
  parent_product_code?: string;
  warehouse_id?: string;
  quantity_parent?: number;
  child_product?: AddSplitStockProductChildProductBody[];
}
