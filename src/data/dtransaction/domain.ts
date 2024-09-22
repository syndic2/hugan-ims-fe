import { BaseSelect } from '../../commons/common';

import { GetProductsSelectItemRes } from '../product/contracts';
import { Product } from "../product/domain";

interface DTransactionProps {
  id?: number;
  object_id?: string;
  transaction_id?: string;

  product?: Product;
  product_select?: BaseSelect<string>;

  quantity?: number;
  price?: number;
  discount?: number;
  ppn?: number;
  remark?: string;
  created_at?: string;

  is_combined?: boolean;
  sub_total?: number;
  items?: DTransactionProps[];
}

export const InitialDtransaction: DTransactionProps = {
  quantity: 1,
  price: 0,
  discount: 0
};

export const InitialCombinedDtransaction: DTransactionProps = {
  remark: '',
  quantity: 1,
  price: 0,
  discount: 0,
  is_combined: true,
  items: []
};

export const InitialDeliveryNoteDtransaction: DTransactionProps = {
  quantity: 1
};

export const InitialCombinedDeliveryNoteDtransaction: DTransactionProps = {
  remark: '',
  quantity: 1,
  is_combined: true
};

export const InitialSplitStockProductDtransaction: DTransactionProps = {
  quantity: 0
};

export class DTransaction {
  public props: DTransactionProps;

  protected constructor(props: DTransactionProps) {
    this.props = props;
  }

  static create(props: DTransactionProps): DTransaction {
    return new DTransaction(props);
  }

  get id(): number | undefined {
    return this.props.id;
  }

  get objectId(): string | undefined {
    return this.props.object_id;
  }

  get transactionId(): string | undefined {
    return this.props.transaction_id;
  }

  get product(): Product | undefined {
    return this.props.product;
  }

  get productSelect(): BaseSelect<string, GetProductsSelectItemRes> | undefined {
    return this.props.product_select;
  }

  get quantity(): number | undefined {
    return this.props.quantity;
  }

  get price(): number | undefined {
    return this.props.price;
  }

  get discount(): number | undefined {
    return this.props.discount;
  }

  get ppn(): number | undefined {
    return this.props.ppn;
  }

  get remark(): string | undefined {
    return this.props.remark;
  }

  get createdAt(): string | undefined {
    return this.props.created_at;
  }

  get isCombined(): boolean | undefined {
    return this.props.is_combined;
  }

  get items(): DTransaction[] | undefined {
    return (this.props.items || []).map(item => DTransaction.create(item));
  }

  get subTotal(): number | undefined {
    return this.props.sub_total;
  }

  public getProductName(): string | undefined {
    return this.isCombined ? this.remark : this.product?.productName;
  }

  public getQuantity(): number | undefined {
    return this.isCombined ? this.items?.length : this.quantity;
  }
}
