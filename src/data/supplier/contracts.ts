import { BaseListQueryParam } from '../../commons/common';

export interface GetSuppliersQuery extends BaseListQueryParam {
  is_active?: boolean | string;
}

export interface GetSuppliersItemRes {
  id?: number;
  supplier_name?: string;
  npwp: string;
  phone_number: string;
  address: string;
  is_active?: boolean;
}

export interface GetSuppliersSelectItemRes {
  id?: number;
  supplier_name?: string;
  npwp?: string;
}

export interface GetSupplierParam {
  id?: number;
}

export interface AddSupplierBody {
  supplier_name?: string;
  npwp?: string;
  address?: string;
  phone_number?: string;
}

export interface AddSupplierRes {
  id?: number;
}

export interface GetSupplierTransactionsRes {
  transaction_id?: string;
  nota_id?: string;
  warehouse_id?: string;
  transaction_type?: string;
  created_at?: string;
}

export interface GetSupplierRes extends GetSuppliersItemRes {
  created_at?: string;
  updated_at?: string;
  transaction?: GetSupplierTransactionsRes[];
}

export interface UpdateSupplierParam extends GetSupplierParam { }

export interface UpdateSupplierBody extends AddSupplierBody {
  is_active?: boolean;
}
