export interface TransactionItemErrors {
  object_id?: string;
  product_code?: string;
}

export interface CombinedTransactionItemErrors {
  object_id?: string;
  remark?: string;
  items?: string;
}

export interface AddPurchaseTransactionErrors {
  transaction_id?: string;
  warehouse_id?: string;
  supplier_id?: string;
  items?: string;
}

export interface AddSaleTransactionErrors {
  warehouse_id?: string;
  customer_id?: string;
  items?: string;
  remark?: string;
}

export interface AddCombinedTransactionItemModalErrors {
  remark?: string;
  items?: string;
}

export interface AddDeliveryNoteTransactionErrors {
  warehouse_id?: string;
  transaction_id?: string;
  start_date?: string;
  end_date?: string;
  items?: string;
}

export interface AddSplitStockProductErrors {
  warehouse_id?: string;
  parent_product_code?: string;
  items?: string;
}
