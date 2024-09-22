export interface AddCustomerErrors {
  customer_name?: string;
  npwp?: string;
  address?: string;
}
export interface UpdateCustomerErrors extends AddCustomerErrors {}
