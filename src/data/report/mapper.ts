import {
  GetSalesVolumeReportsRes,
  GetProductReportsItemRes,
  GetSupplierReportsItemRes,
  GetCustomerReportsItemRes,
  GetTransactionReportsItemRes
} from './contracts';

import { Product } from '../product/domain';
import { Supplier } from '../supplier/domain';
import { Customer } from '../customer/domain';
import {
  SalesVolumeReport,
  ProductReport,
  SupplierReport,
  CustomerReport,
  TransactionReport
} from './domain';

export class ReportMapper {

  static mapGetSalesVolumeReportsResToDomain(data: GetSalesVolumeReportsRes[]): SalesVolumeReport[] {
    return (data || []).map(item => SalesVolumeReport.create({
      ...item.warehouse_id && { warehouse_id: item.warehouse_id },
      ...item.purchase !== undefined && { count_purchase: item.purchase },
      ...item.total_purchase !== undefined && { grand_total_purchase: item.total_purchase },
      ...item.sales !== undefined && { count_sale: item.sales },
      ...item.total_sales !== undefined && { grand_total_sale: item.total_sales }
    }));
  }

  static mapGetProductReportsItemResToDomain(data: GetProductReportsItemRes): ProductReport {
    return ProductReport.create({
      product: Product.create({
        ...data.product_code && { product_code: data.product_code },
        ...data.product_name && { product_name: data.product_name },
      }),
      ...data.qty !== undefined && { qty: data.qty }
    });
  }

  static mapGetSupplierReportsItemResToDomain(data: GetSupplierReportsItemRes): SupplierReport {
    return SupplierReport.create({
      supplier: Supplier.create({
        ...data.supplier_id && { id: data.supplier_id },
        ...data.supplier_name && { supplier_name: data.supplier_name },
      }),
      ...data.qty !== undefined && { qty: data.qty }
    });
  }

  static mapGetCustomerReportsItemResToDomain(data: GetCustomerReportsItemRes): CustomerReport {
    return CustomerReport.create({
      customer: Customer.create({
        ...data.customer_id && { id: data.customer_id },
        ...data.customer_name && { customer_name: data.customer_name },
      }),
      ...data.qty !== undefined && { qty: data.qty }
    });
  }

  static mapGetTransactionReportsItemResToDomain(data: GetTransactionReportsItemRes): TransactionReport {
    return TransactionReport.create({
      ...data.transaction_id && { transaction_id: data.transaction_id },
      ...data.transaction_date && { transaction_date: data.transaction_date },
      ...data.name && { name: data.name },
      ...data.price && { price: data.price },
      ...data.quantity && { quantity: data.quantity }
    });
  }
}
