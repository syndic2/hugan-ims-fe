import { Product } from '../product/domain';
import { Supplier } from '../supplier/domain';
import { Customer } from '../customer/domain';

interface SalesVolumeReportProps {
  warehouse_id?: string;
  count_purchase?: number;
  grand_total_purchase?: number;
  count_sale?: number;
  grand_total_sale?: number;
}

export class SalesVolumeReport {
  public props: SalesVolumeReportProps;

  protected constructor(props: SalesVolumeReportProps) {
    this.props = props;
  }

  static create(props: SalesVolumeReportProps): SalesVolumeReport {
    return new SalesVolumeReport(props);
  }

  get warehouseId(): string | undefined {
    return this.props.warehouse_id;
  }

  get countPurchase(): number | undefined {
    return this.props.count_purchase;
  }

  get grandTotalPurchase(): number | undefined {
    return this.props.grand_total_purchase;
  }

  get countSale(): number | undefined {
    return this.props.count_sale;
  }

  get grandTotalSale(): number | undefined {
    return this.props.grand_total_sale;
  }
}

interface ProductReportProps {
  product?: Product;
  qty?: number;
}

export class ProductReport {
  public props: ProductReportProps;

  protected constructor(props: ProductReportProps) {
    this.props = props;
  }

  static create(props: ProductReportProps): ProductReport {
    return new ProductReport(props);
  }

  get product(): Product | undefined {
    return this.props.product;
  }

  get qty(): number | undefined {
    return this.props.qty;
  }
}

interface SupplierReportProps {
  supplier?: Supplier;
  qty?: number;
}

export class SupplierReport {
  public props: SupplierReportProps;

  protected constructor(props: SupplierReportProps) {
    this.props = props;
  }

  static create(props: SupplierReportProps): SupplierReport {
    return new SupplierReport(props);
  }

  get supplier(): Supplier | undefined {
    return this.props.supplier;
  }

  get qty(): number | undefined {
    return this.props.qty;
  }
}

interface CustomerReportProps {
  customer?: Customer;
  qty?: number;
}

export class CustomerReport {
  public props: CustomerReportProps;

  protected constructor(props: CustomerReportProps) {
    this.props = props;
  }

  static create(props: CustomerReportProps): CustomerReport {
    return new CustomerReport(props);
  }

  get customer(): Customer | undefined {
    return this.props.customer;
  }

  get qty(): number | undefined {
    return this.props.qty;
  }
}

interface TransactionReportProps {
  transaction_id?: string;
  transaction_date?: string
  name?: string;
  price?: number;
  quantity?: number;
}

export class TransactionReport {
  public props: TransactionReportProps;

  protected constructor(props: TransactionReportProps) {
    this.props = props;
  }

  static create(props: TransactionReportProps): TransactionReport {
    return new TransactionReport(props);
  }

  get transactionId(): string | undefined {
    return this.props.transaction_id;
  }

  get transactionDate(): string | undefined {
    return this.props.transaction_date;
  }

  get name(): string | undefined {
    return this.props.name;
  }

  get price(): number | undefined {
    return this.props.price;
  }

  get quantity(): number | undefined {
    return this.props.quantity;
  }
}
