import { Transaction } from '../transaction/domain';

interface CustomerProps {
  id?: number;
  customer_name?: string;
  address?: string;
  phone_number?: string;
  npwp?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  transactions?: Transaction[];
}

export const InitialCustomer: CustomerProps = {
  customer_name: '',
  address: '',
  npwp: '',
  phone_number: ''
};

export class Customer {
  public props: CustomerProps;

  protected constructor(props: CustomerProps) {
    this.props = props;
  }

  static create(props: CustomerProps): Customer {
    return new Customer(props);
  }

  get id(): number | undefined {
    return this.props.id;
  }

  get customerName(): string | undefined {
    return this.props.customer_name;
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
