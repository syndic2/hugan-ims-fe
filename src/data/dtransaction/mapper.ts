import { GetTransactionDtransactionsRes, GetTransactionDtransactionsProductRes } from '../transaction/contracts';
import { Product } from '../product/domain';
import { DTransaction } from './domain';

export class DTransactionMapper {

  private static mapGetTransactionDtransactionsProductResToDomain(data: GetTransactionDtransactionsProductRes): DTransaction {
    return DTransaction.create({
      product: Product.create({
        ...data.product_code && { product_code: data.product_code },
        ...data.product_name && { product_name: data.product_name }
      }),
      product_select: {
        label: data.product_name || '-',
        value: data.product_code || ''
      },
      ...data.quantity !== undefined && { quantity: data.quantity },
      ...data.price !== undefined && { price: data.price },
      ...data.discount !== undefined && { discount: data.discount },
      ...data.ppn !== undefined && { ppn: data.ppn },
      ...data.total !== undefined && { sub_total: data.total }
    })
  }

  static mapGetTransactionDtransactionsResToDomain(data: GetTransactionDtransactionsRes): DTransaction {
    return DTransaction.create({
      ...data.remark && { remark: data.remark },
      ...data.is_combined && { is_combined: data.is_combined },
      ...data.subtotal !== undefined && { sub_total: data.subtotal },
      ...(data.is_combined === false) && {
        ...data.product && { ...this.mapGetTransactionDtransactionsProductResToDomain(data.product as GetTransactionDtransactionsProductRes).props },
      },
      ...(data.is_combined === true) && {
        ...data.quantity !== undefined && { quantity: data.quantity },
        ...data.price !== undefined && { price: data.price },
        ...data.discount !== undefined && { discount: data.discount },
        items: (data.product as GetTransactionDtransactionsProductRes[] || []).map(item => this.mapGetTransactionDtransactionsProductResToDomain(item).props)
      }
    });
  }
}
