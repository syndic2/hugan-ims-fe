import { BaseListQueryParam } from '../../commons/common';

export interface GetCustomersQuery extends BaseListQueryParam {
  is_active?: boolean | string;
}

export interface GetCustomersItemRes {
  id?: number;
  customer_name?: string;
  npwp: string;
  phone_number: string;
  address: string;
  is_active?: boolean;
}

export interface GetCustomersSelectItemRes {
  id?: number;
  customer_name?: string;
  npwp?: string;
}

export interface GetCustomerParam {
  id?: number;
}

export interface GetCustomerTransactionsRes {
  transaction_id?: string;
  nota_id?: string;
  warehouse_id?: string;
  transaction_type?: string;
  created_at?: string;
}

export interface GetCustomerRes extends GetCustomersItemRes {
  created_at?: string;
  updated_at?: string;
  transaction?: GetCustomerTransactionsRes[];
}

export interface AddCustomerBody {
  customer_name?: string;
  npwp?: string;
  address?: string;
  phone_number?: string;
}

export interface AddCustomerRes {
  id?: number;
}

export interface UpdateCustomerParam extends GetCustomerParam { }

export interface UpdateCustomerBody extends AddCustomerBody {
  is_active?: boolean;
}
