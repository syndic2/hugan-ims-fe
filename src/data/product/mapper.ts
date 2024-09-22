import { BaseSelect } from '../../commons/common';

import { TransactionMapper } from '../transaction/mapper';

import {
  GetProductsItemRes,
  GetProductsSelectItemRes,
  GetProductRes,
  AddProductBody,
  UpdateProductBody
} from './contracts';
import { Product } from './domain';

export class ProductMapper {

  static mapGetProductsItemResToDomain(data: GetProductsItemRes): Product {
    return Product.create({
      ...data.product_code && { product_code: data.product_code },
      ...data.product_name && { product_name: data.product_name },
      ...data.sku && { sku: data.sku },
      ...data.qty_retail !== undefined && { qty_retail: data.qty_retail },
      ...data.qty_warehouse !== undefined && { qty_warehouse: data.qty_warehouse },
      ...data.is_active && { is_active: data.is_active }
    });
  }

  static mapGetProductsSelectItemResToDomain(data: GetProductsSelectItemRes): BaseSelect<string> {
    return {
      label: data.product_name || '-',
      value: data.product_code || '',
      data
    };
  }

  static mapGetProductResToDomain = (data: GetProductRes): Product => {
    return Product.create({
      ...this.mapGetProductsItemResToDomain(data).props,
      ...data.description && { description: data.description },
      ...data.created_at && { created_at: data.created_at },
      ...data.updated_at && { updated_at: data.updated_at },
      ...data.transaction && {
        transactions: (data.transaction || []).map(item => TransactionMapper.mapGetProductTransactionsResToDomain(item))
      }
    });
  };

  static mapDomainToAddProductBody(data: Product): AddProductBody {
    return {
      product_name: data.productName,
      sku: data.sku,
      description: data.description
    };
  }

  static mapDomainToUpdateProductBody(data: Product): UpdateProductBody {
    return {
      ...this.mapDomainToAddProductBody(data),
      qty_retail: data.qtyRetail,
      qty_warehouse: data.qtyWarehouse,
      is_active: data.isActive
    };
  }
}
