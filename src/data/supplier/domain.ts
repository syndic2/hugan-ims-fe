import { Transaction } from '../transaction/domain';

interface SupplierProps {
  id?: number;
  supplier_name?: string;
  address?: string;
  phone_number?: string;
  npwp?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  transactions?: Transaction[];
}

export const InitialSupplier: SupplierProps = {
  supplier_name: '',
  address: '',
  npwp: '',
  phone_number: ''
};

export class Supplier {
  public props: SupplierProps;

  protected constructor(props: SupplierProps) {
    this.props = props;
  }

  static create(props: SupplierProps): Supplier {
    return new Supplier(props);
  }

  get id(): number | undefined {
    return this.props.id;
  }

  get supplierName(): string | undefined {
    return this.props.supplier_name;
  }
  get address(): string | undefined {
    return this.props.address;
  }
  get npwp(): string | undefined {
    return this.props.npwp;
  }
  get phoneNumber(): string | undefined {
    return this.props.phone_number;
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
