import { BaseSelect } from '../../commons/common';

import { GetProductTransactionsRes } from '../product/contracts';
import { GetSupplierTransactionsRes } from '../supplier/contracts';
import { GetCustomerTransactionsRes } from '../customer/contracts';

import {
  GetTransactionsItemRes,
  GetTransactionRes,
  AddPurchaseTransactionItemsBody,
  AddPurchaseTransactionBody,
  AddSaleTransactionBody,
  AddSplitStockProductBody
} from "./contracts";

import { CustomerMapper } from '../customer/mapper';
import { SupplierMapper } from '../supplier/mapper';
import { DTransactionMapper } from '../dtransaction/mapper';

import { Transaction } from "./domain";
import { DTransaction } from '../dtransaction/domain';

export class TransactionMapper {

  static mapGetTransactionsItemResToDomain(data: GetTransactionsItemRes): Transaction {
    return Transaction.create({
      ...data.transaction_id && { transaction_id: data.transaction_id },
      ...data.nota_id && { nota_id: data.nota_id },
      ...data.transaction_type && { transaction_type: data.transaction_type },
      ...data.warehouse_id && { warehouse_id: data.warehouse_id },
      ...data.customer && { customer: CustomerMapper.mapGetTransactionCustomerRes(data.customer) },
      ...data.supplier && { supplier: SupplierMapper.mapGetTransactionSupplierResToDomain(data.supplier) },
      ...data.items !== undefined && { items: data.items },
      ...data.total !== undefined && { total: data.total },
      ...data.created_at && { created_at: data.created_at }
    });
  }

  static mapGetTransactionsSelectItemResToDomain(data: string): BaseSelect<string> {
    return {
      label: data || '-',
      value: data || ''
    };
  }

  static mapGetTransactionResToDomain(data: GetTransactionRes): Transaction {
    return Transaction.create({
      ...this.mapGetTransactionsItemResToDomain(data).props,
      ...data.discount !== undefined && { discount: data.discount },
      ...data.subtotal !== undefined && { subtotal: data.subtotal },
      ...data.total_wo_tax !== undefined && { total_wo_tax: data.total_wo_tax },
      ...(data.dtransactions && data.dtransactions.length > 0) && {
        ppn: data.ppn,
        dtransactions: data.dtransactions.map(item => DTransactionMapper.mapGetTransactionDtransactionsResToDomain(item))
      }
    });
  }

  private static mapDomainAddPurchaseTransactionItemsBody(transaction: Transaction, data: DTransaction): AddPurchaseTransactionItemsBody {
    return {
      product_id: data.productSelect?.value,
      quantity: Number(data.quantity),
      price: Number(data.price),
      discount: Number(data.discount),
      ppn: Number(transaction.ppn)
    };
  }

  static mapDomainToAddPurchaseTransactionBody(data: Transaction): AddPurchaseTransactionBody {
    return {
      transaction_id: data.transactionId,
      supplier_id: data.supplierSelect?.value,
      warehouse_id: data.warehouseSelect?.value,
      items: (data.dtransactions || []).map(item => ({
        ...this.mapDomainAddPurchaseTransactionItemsBody(data, item)
      }))
    };
  }

  static mapDomainToAddSaleTransactionBody(data: Transaction): AddSaleTransactionBody {
    const singleItems = (data.dtransactions || []).filter(item => !item.isCombined);
    const combinedItems = (data.dtransactions || [])
      .filter(item => item.isCombined && item.isCombined === true)
      .flatMap(itemParent => (itemParent.items || []).map((itemChildren, idx) => DTransaction.create({
        ...itemChildren.props,
        is_combined: itemParent.isCombined,
        remark: `${itemParent.remark}|${itemParent.quantity}`,
        quantity: itemChildren.quantity,
        price: idx === 0 ? itemParent.price : 0,
        discount: idx === 0 ? itemParent.discount : 0
      })));

    const items: DTransaction[] = [...singleItems, ...combinedItems];

    return {
      warehouse_id: data.warehouseSelect?.value,
      customer_id: data.customerSelect?.value,
      discount: Number(data.discount),
      items: items.map(item => {
        if (item.isCombined && item.isCombined === true) {
          return {
            ...this.mapDomainAddPurchaseTransactionItemsBody(data, item),
            remark: item.remark
          };
        }

        return {
          ...this.mapDomainAddPurchaseTransactionItemsBody(data, item)
        };
      })
    };
  }

  static mapDomainToAddSplitStockProductBody(data: Transaction): AddSplitStockProductBody {
    return {
      parent_product_code: data.parentProductSelect?.value,
      warehouse_id: data.warehouseSelect?.value,
      quantity_parent: data.quantityParentProduct,
      child_product: (data.dtransactions || []).map(item => ({
        product_code: item.productSelect?.value,
        quantity: Number(item.quantity)
      }))
    };
  }

  static mapGetProductTransactionsResToDomain(data: GetProductTransactionsRes): Transaction {
    return Transaction.create({
      ...data.transaction_id && { transaction_id: data.transaction_id },
      ...data.nota_id && { nota_id: data.nota_id },
      ...data.warehouse_id && { warehouse_id: data.warehouse_id },
      ...data.transaction_type && { transaction_type: data.transaction_type },
      ...data.created_at && { created_at: data.created_at }
    });
  }

  static mapGetSupplierTransactionsResToDomain(data: GetSupplierTransactionsRes): Transaction {
    return this.mapGetProductTransactionsResToDomain(data);
  }

  static mapGetCustomerTransactionsResToDomain(data: GetCustomerTransactionsRes): Transaction {
    return this.mapGetProductTransactionsResToDomain(data);
  }
}
