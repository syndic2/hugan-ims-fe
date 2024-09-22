import { Transaction } from '../transaction/domain';

interface ProductProps {
  product_code?: string;
  product_name?: string;
  sku?: string;
  description?: string;
  qty_retail?: number;
  qty_warehouse?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  transactions?: Transaction[];
}

export const InitialProduct: ProductProps = {
  product_name: '',
  sku: '',
  description: '',
  qty_retail: 0,
  qty_warehouse: 0
};

export class Product {
  public props: ProductProps;

  protected constructor(props: ProductProps) {
    this.props = props;
  }

  static create(props: ProductProps): Product {
    return new Product(props);
  }

  get productCode(): string | undefined {
    return this.props.product_code;
  }

  get productName(): string | undefined {
    return this.props.product_name;
  }

  get sku(): string | undefined {
    return this.props.sku;
  }

  get description(): string | undefined {
    return this.props.description;
  }

  get qtyRetail(): number | undefined {
    return this.props.qty_retail;
  }

  get qtyWarehouse(): number | undefined {
    return this.props.qty_warehouse;
  }

  get isActive(): boolean | undefined {
    return this.props.is_active;
  }

  get createdAt(): string | undefined {
    return this.props.created_at;
  }

  get updatedAt(): string | undefined {
    return this.props.updated_at;
  }

  get transactions(): Transaction[] | undefined {
    return this.props.transactions;
  }

  getActiveLabel(): string {
    return this.isActive && this.isActive === true ? 'Aktif' : 'Tidak Aktif';
  }
}
