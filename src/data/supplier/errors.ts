export interface AddSupplierErrors {
  supplier_name?: string;
  npwp?: string;
  address?: string;
}
export interface UpdateSupplierErrors extends AddSupplierErrors {}
