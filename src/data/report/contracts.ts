import { BaseListQueryParam } from '../../commons/common';

export interface GetSalesVolumeReportsQuery {
  start_date?: string;
  end_date?: string;
}

export interface GetSalesVolumeReportsRes {
  warehouse_id?: string;
  purchase?: number;
  total_purchase?: number;
  sales?: number;
  total_sales?: number;
}

export interface GetProductReportsQuery extends BaseListQueryParam {
  warehouse_id?: string;
  transaction_type?: string;
  start_date?: string;
  end_date?: string;
}

export interface GetProductReportsItemRes {
  product_code?: string;
  product_name?: string;
  qty?: number;
}

export interface GetSupplierReportsQuery extends GetProductReportsQuery {
}

export interface GetSupplierReportsItemRes {
  supplier_id?: number;
  supplier_name?: string;
  qty?: number;
}

export interface GetCustomerReportsQuery extends GetProductReportsQuery {
}

export interface GetCustomerReportsItemRes {
  customer_id?: number;
  customer_name?: string;
  qty?: number;
}

export interface GetTransactionReportsQuery extends BaseListQueryParam {
  warehouse_id?: string;
  transaction_type?: string;
  product_code?: string;
  start_date?: string;
  end_date?: string;
}

export interface GetTransactionReportsItemRes {
  transaction_id?: string;
  transaction_date?: string;
  name?: string;
  price?: number;
  quantity?: number;
}
