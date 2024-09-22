import { BaseListQueryParam } from '../../commons/common';

export interface GetProductsQuery extends BaseListQueryParam {
  is_active?: string | boolean;
}

export interface GetProductsItemRes {
  product_code?: string;
  product_name?: string;
  sku?: string;
  qty_retail?: number;
  qty_warehouse?: number;
  is_active?: boolean;
}

export interface GetProducstSelectQuery extends BaseListQueryParam {
}

export interface GetProductsSelectItemRes {
  product_code?: string;
  product_name?: string;
  qty_retail?: number;
}

export interface GetProductParam {
  product_code?: string;
}

export interface GetProductTransactionsRes {
  transaction_id?: string;
  nota_id?: string;
  warehouse_id?: string;
  transaction_type?: string;
  created_at?: string;
}

export interface GetProductRes extends GetProductsItemRes {
  description?: string;
  created_at?: string;
  updated_at?: string
  transaction?: GetProductTransactionsRes[];
}

export interface AddProductBody {
  product_name?: string;
  sku?: string;
  description?: string;
}

export interface AddProductRes {
  product_code?: string;
}

export interface UpdateProductParam extends GetProductParam {
}

export interface UpdateProductBody extends AddProductBody {
  qty_retail?: number;
  qty_warehouse?: number;
  is_active?: boolean;
}

export interface SplitStockProductBody {
  parent_product_code?: string;
  quantity?: number;
  child_products: {
    product_code?: string,
    quantity?: number
  }[];
}
